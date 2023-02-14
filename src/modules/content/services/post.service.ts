import { Injectable } from '@nestjs/common';

import { isArray, isNil, omit } from 'lodash';
import { EntityNotFoundError, In, IsNull, Not, SelectQueryBuilder } from 'typeorm';

import { PostOrderType } from '@/modules/content/constans';
import { CreatePostDto, QueryPostDto, UpdatePostDto } from '@/modules/content/dtos';
import { PostEntity } from '@/modules/content/entities';
import { CategoryRepository, PostRepository } from '@/modules/content/repositories';
import { CategoryService } from '@/modules/content/services/category.service';
import { SearchService } from '@/modules/content/services/search.service';
import { SelectTrashMode } from '@/modules/database/constants';
import { paginate } from '@/modules/database/helpers';
import { QueryHook } from '@/modules/database/types';

type FindParams = {
    [key in keyof Omit<QueryPostDto, 'limit' | 'page'>]: QueryPostDto[key];
};

@Injectable()
export class PostService {
    constructor(
        protected repository: PostRepository,
        protected categoryService: CategoryService,
        protected categoryRepository: CategoryRepository,
        protected searchService?: SearchService,
    ) {}

    async paginate(options: QueryPostDto, callback?: QueryHook<PostEntity>) {
        const qb = await this.buildQueryList(this.repository.buildBaseQB(), options, callback);
        return paginate(qb, options);
    }

    async create(data: CreatePostDto) {
        const createPostDto = {
            ...data,
            // 文章所属分类
            categories: isArray(data.categories)
                ? await this.categoryRepository.findBy({
                      id: In(data.categories),
                  })
                : [],
        };
        console.log(createPostDto);
        const item = await this.repository.save(createPostDto);
        return this.detail(item.id);
    }

    async detail(id: number) {
        const item = await this.repository.buildBaseQB().where({ id }).getOne();
        if (!item) {
            throw new EntityNotFoundError(PostEntity, `The post ${id} not exists!`);
        }

        return item;
    }

    async update(data: UpdatePostDto) {
        const post = await this.detail(data.id);
        if (isArray(data.categories)) {
            // 更新文章所属分类
            await this.repository
                .createQueryBuilder('post')
                .relation(PostEntity, 'categories')
                .of(post)
                .addAndRemove(data.categories, post.categories ?? []);
        }
        await this.repository.update(data.id, omit(data, ['id', 'categories']));
        return this.detail(data.id);
    }

    async delete(ids: number[], trash?: boolean) {
        const items = await this.repository.find({
            where: { id: In(ids) },
            withDeleted: true,
        });
        if (trash) {
            const directs = items.filter((item) => !isNil(item.deletedAt));
            const softS = items.filter((item) => isNil(item.deletedAt));

            return [
                ...(await this.repository.remove(directs)),
                ...(await this.repository.softRemove(softS)),
            ];
        }

        return this.repository.remove(items);
    }

    async restore(ids: number[]) {
        const items = await this.repository.find({
            where: { id: In(ids) },
            withDeleted: true,
        });

        const trashedS = items.filter((item) => !isNil(item)).map((item) => item.id);
        if (trashedS.length === 0) {
            return [];
        }

        await this.repository.restore(trashedS);

        const qb = await this.buildQueryList(this.repository.buildBaseQB(), {}, async (qBuilder) =>
            qBuilder.andWhereInIds(trashedS),
        );

        return qb.getMany();
    }

    protected async buildQueryList(
        qb: SelectQueryBuilder<PostEntity>,
        options: FindParams,
        callback?: QueryHook<PostEntity>,
    ) {
        const { isPublished, orderBy, category, trashed = SelectTrashMode.NONE } = options;

        if (trashed === SelectTrashMode.ALL || trashed === SelectTrashMode.ONLY) {
            qb.withDeleted();
            if (trashed === SelectTrashMode.ONLY) {
                qb.where({
                    deletedAt: Not(null),
                });
            }
        }

        if (typeof isPublished === 'boolean') {
            isPublished
                ? qb.where({
                      publishedAt: Not(IsNull()),
                  })
                : qb.where({
                      publishedAt: IsNull(),
                  });
        }
        this.queryByOrder<PostEntity>(qb, orderBy);

        if (category) {
            await this.queryByCategory(qb, category);
        }

        if (typeof callback === 'function') {
            return callback(qb);
        }

        return qb;
    }

    protected queryByOrder<T>(
        qb: SelectQueryBuilder<T>,
        orderBy?: PostOrderType,
    ): SelectQueryBuilder<T> {
        switch (orderBy) {
            case PostOrderType.CREATED:
                return qb.orderBy('post.createdAt', 'DESC');
            case PostOrderType.PUBLISH_AT:
                return qb.orderBy('post.publishedAt', 'DESC');
            case PostOrderType.UPDATED:
                return qb.orderBy('post.updatedAt', 'DESC');
            case PostOrderType.CUSTOMER:
                return qb.orderBy('post.customerOrder', 'DESC');
            case PostOrderType.COMMENT:
                return qb.orderBy('commentCount', 'DESC');
            default:
                return qb
                    .orderBy('post.createdAt', 'DESC')
                    .addOrderBy('post.updatedAt', 'DESC')
                    .addOrderBy('post.publishedAt', 'DESC');
        }
    }

    protected async queryByCategory(qb: SelectQueryBuilder<PostEntity>, category: number) {
        const root = await this.categoryService.detail(category);
        const tree = await this.categoryRepository.findDescendantsTree(root);
        const flatDes = await this.categoryRepository.toFlatTrees(tree.children);
        const ids = [root.id, ...flatDes.map((v) => v.id)];
        return qb.where('categories.id IN (:...ids)', { ids });
    }
}
