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
import { isNumber, toNumber } from 'lodash';

export class CreateCategoryDto {
    @MaxLength(25, { always: true, message: '分类名称长度不得超过$constraint1' })
    @IsNotEmpty({ groups: ['create'], message: '分类名称不能为空' })
    @IsOptional({ groups: ['update'] })
    name!: string;

    @Transform(({ value }) => toNumber(value))
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

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    @IsNumber()
    @IsDefined({ groups: ['update'] })
    id!: number;
}
