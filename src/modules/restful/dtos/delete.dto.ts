import { Transform } from 'class-transformer';
import { IsDefined, IsNumber } from 'class-validator';

import { toNumber } from 'lodash';

import { DtoValidation } from '@/modules/core/decorators';

@DtoValidation()
export class DeleteDto {
    @Transform(({ value }) => value.map((v: any) => (v === undefined ? v : toNumber(v))))
    @IsNumber(undefined, { each: true, message: 'id格式错误' })
    @IsDefined({ each: true, message: 'ID必须指定' })
    ids: number[];
}
