import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { toNumber } from 'lodash';

import { PostOrderType } from '@/modules/content/constans';
import { toBoolean } from '@/modules/core/helpers';
import { PaginateOptions } from '@/modules/database/types';

export class QueryPostDto implements PaginateOptions {
    @Transform(({ value }) => toNumber(value))
    @IsNumber()
    @Min(1, { message: '每页显示数量最小为1' })
    limit = 10;

    @Transform(({ value }) => toNumber(value))
    @IsNumber()
    @Min(1, { message: '页数最小为1' })
    page = 1;

    @Transform(({ value }) => toBoolean(value))
    @IsBoolean()
    @IsOptional()
    isPublished?: boolean;

    @IsOptional()
    @IsEnum(PostOrderType, { message: `排序规则必须是${Object.values(PostOrderType).join(',')}` })
    orderBy?: PostOrderType;
}

export class CreatePostDto {
    title!: string;
}
