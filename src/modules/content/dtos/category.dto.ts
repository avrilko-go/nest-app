import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsDefined,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    MaxLength,
    Min,
    ValidateIf,
} from 'class-validator';
import { isNumber, isUndefined, toNumber } from 'lodash';

import { CategoryEntity } from '@/modules/content/entities';
import { DtoValidation } from '@/modules/core/decorators';
import { IsDataExist } from '@/modules/database/constraints';
import { PaginateOptions } from '@/modules/database/types';

@DtoValidation({
    type: 'query',
})
export class QueryCategoryDto implements PaginateOptions {
    @Transform(({ value }) => toNumber(value))
    @Min(1, { message: '每页显示数据必须大于1' })
    @IsNumber()
    @IsOptional()
    limit = 10;

    @Transform(({ value }) => toNumber(value))
    @Min(1, { message: '当前页必须大于1' })
    @IsNumber()
    @IsOptional()
    page = 1;
}

@DtoValidation({
    type: 'body',
    groups: ['create'],
})
export class CreateCategoryDto {
    @MaxLength(25, { always: true, message: '分类名称长度不得超过$constraint1' })
    @IsNotEmpty({ groups: ['create'], message: '分类名称不能为空' })
    @IsOptional({ groups: ['update'] })
    name!: string;

    @IsDataExist(CategoryEntity, { always: true, message: '父分类不存在' })
    @Transform(({ value }) => (isUndefined(value) ? value : toNumber(value)))
    @IsOptional({ always: true })
    @IsNumber(undefined, { always: true })
    @ValidateIf((value) => isNumber(value.parent))
    parent?: number;

    @Transform(({ value }) => toNumber(value))
    @Min(0, { always: true, message: '排序值必须大于0' })
    @IsNumber(undefined, { always: true })
    @IsOptional({ always: true })
    customOrder = 0;
}

@DtoValidation({
    type: 'body',
    groups: ['update'],
})
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    @IsNumber()
    @IsDefined({ groups: ['update'] })
    id!: number;
}
