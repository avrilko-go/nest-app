import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsBoolean,
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    MaxLength,
    Min,
    ValidateIf,
} from 'class-validator';
import { isNil, toNumber } from 'lodash';

import { PostOrderType, PostType } from '@/modules/content/constans';
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
    @MaxLength(255, { message: '标题最长255', always: true })
    @IsOptional({ groups: ['update'] })
    @IsNotEmpty({ groups: ['create'], message: '文章标题必须填写' })
    title!: string;

    @IsOptional({ groups: ['update'] })
    @IsNotEmpty({ groups: ['create'], message: '文章内容必须填写' })
    body!: string;

    @MaxLength(255, { message: '描述最长255', always: true })
    @IsOptional({ always: true })
    summary?: string;

    @IsEnum(PostType, {
        always: true,
        message: `文章类型必须是${Object.values(PostType).join(',')}`,
    })
    type!: PostType;

    @IsDateString({ strict: true }, { always: true })
    @IsOptional({ always: true })
    @Transform(({ value }) => (value === 'null' ? null : value))
    @ValidateIf((value) => !isNil(value.publishAt))
    publishedAt?: Date;

    @MaxLength(20, { each: true, always: true, message: '每个关键字长最大20' })
    @IsOptional({ always: true })
    keywords?: string[];

    @Min(0, { message: '排序最小为0', always: true })
    @Transform(({ value }) => toNumber(value))
    @IsOptional({ always: true })
    @IsNumber(undefined, { always: true })
    customerOrder?: number;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {
    @IsOptional({ groups: ['create'] })
    @Transform(({ value }) => toNumber(value))
    @IsNumber(undefined, { always: true })
    id!: number;
}
