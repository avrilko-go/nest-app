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

/**
 * 数据手动分页函数
 * @param options 分页选项
 * @param data 数据列表
 */
export function manualPaginate<E extends ObjectLiteral>(
    options: PaginateOptions,
    data: E[],
): PaginateReturn<E> {
    const { page, limit } = options;
    let items: E[] = [];
    const totalItems = data.length;
    const totalRst = totalItems / limit;
    const totalPages =
        totalRst > Math.floor(totalRst) ? Math.floor(totalRst) + 1 : Math.floor(totalRst);
    let itemCount = 0;
    if (page <= totalPages) {
        itemCount = page === totalPages ? totalItems - (totalPages - 1) * limit : limit;
        const start = (page - 1) * limit;
        items = data.slice(start, start + itemCount);
    }
    return {
        meta: {
            itemsCount: itemCount,
            totalCount: totalItems,
            perPage: limit,
            totalPage: totalPages,
            currentPage: page,
        },
        items,
    };
}
