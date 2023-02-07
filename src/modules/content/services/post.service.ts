import { Injectable } from '@nestjs/common';

import { omit } from 'lodash';
import { EntityNotFoundError, IsNull, Not, SelectQueryBuilder } from 'typeorm';

import { PostOrderType } from '@/modules/content/constans';
import { CreatePostDto, QueryPostDto, UpdatePostDto } from '@/modules/content/dtos';
import { PostEntity } from '@/modules/content/entities';
import { CategoryRepository, PostRepository } from '@/modules/content/repositories';
import { CategoryService } from '@/modules/content/services/category.service';
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
    ) {}

    async paginate(options: QueryPostDto, callback?: QueryHook<PostEntity>) {
        const qb = await this.buildQueryList(this.repository.buildBaseQB(), options, callback);
        return paginate(qb, options);
    }

    async create(data: CreatePostDto) {
        const item = await this.repository.save(data);
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
        await this.repository.update(data.id, omit(data, ['id']));
        return this.detail(data.id);
    }

    async delete(id: number) {
        const item = await this.repository.findOneByOrFail({ id });
        return this.repository.remove(item);
    }

    protected async buildQueryList(
        qb: SelectQueryBuilder<PostEntity>,
        options: FindParams,
        callback?: QueryHook<PostEntity>,
    ) {
        const { isPublished, orderBy, category } = options;

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
