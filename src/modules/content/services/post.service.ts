import { Injectable } from '@nestjs/common';

import { IsNull, Not, SelectQueryBuilder } from 'typeorm';

import { PostOrderType } from '@/modules/content/constans';
import { QueryPostDto } from '@/modules/content/dtos';
import { PostEntity } from '@/modules/content/entities';
import { PostRepository } from '@/modules/content/repositories';
import { paginate } from '@/modules/database/helpers';
import { QueryHook } from '@/modules/database/types';

type FindParams = {
    [key in keyof Omit<QueryPostDto, 'limit' | 'page'>]: QueryPostDto[key];
};

@Injectable()
export class PostService {
    constructor(protected repository: PostRepository) {}

    async paginate(options: QueryPostDto, callback?: QueryHook<PostEntity>) {
        const qb = await this.buildQueryList(this.repository.buildBaseQB(), options, callback);
        return paginate(qb, options);
    }

    protected async buildQueryList(
        qb: SelectQueryBuilder<PostEntity>,
        options: FindParams,
        callback?: QueryHook<PostEntity>,
    ) {
        const { isPublished, orderBy } = options;

        if (typeof isPublished === 'boolean') {
            isPublished
                ? qb.where({
                      publishAt: Not(IsNull()),
                  })
                : qb.where({
                      publishAt: IsNull(),
                  });
        }
        this.queryByOrder<PostEntity>(qb, orderBy);

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
            case PostOrderType.created:
                return qb.orderBy('post.createdAt', 'DESC');
            case PostOrderType.publishAt:
                return qb.orderBy('post.publishedAt', 'DESC');
            case PostOrderType.updated:
                return qb.orderBy('post.updatedAt', 'DESC');
            case PostOrderType.customer:
                return qb.orderBy('post.customerOrder', 'DESC');
            default:
                return qb
                    .orderBy('post.createdAt', 'DESC')
                    .addOrderBy('post.updatedAt', 'DESC')
                    .addOrderBy('post.publishedAt', 'DESC');
        }
    }
}
