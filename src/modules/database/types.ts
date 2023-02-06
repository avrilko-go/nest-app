import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export interface PaginateMeta {
    itemsCount: number;
    totalCount: number;

    perPage: number;
    totalPage: number;
    currentPage: number;
}

export interface PaginateOptions {
    limit: number;

    page: number;
}

export interface PaginateReturn<T extends ObjectLiteral> {
    meta: PaginateMeta;
    items: T[];
}

export type QueryHook<T> = (qb: SelectQueryBuilder<T>) => Promise<SelectQueryBuilder<T>>;
