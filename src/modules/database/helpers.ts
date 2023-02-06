import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

import { PaginateOptions, PaginateReturn } from '@/modules/database/types';

/**
 * 分页函数
 * @param qb
 * @param options
 */
export const paginate = async <T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    options: PaginateOptions,
): Promise<PaginateReturn<T>> => {
    const { page, limit } = options;
    const start = page > 1 ? page - 1 : 1;
    const totalCount = await qb.getCount();
    const totalPage = Math.ceil(totalCount / limit);

    const items = await qb
        .take(limit)
        .limit(limit * start)
        .getMany();

    let itemsCount = 0;
    if (page < totalPage) {
        itemsCount = limit;
    } else if (page === totalPage) {
        itemsCount = items.length;
    }

    return {
        meta: {
            totalCount,
            totalPage,
            itemsCount,
            currentPage: page,
            perPage: limit,
        },
        items,
    };
};
