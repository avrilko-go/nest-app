import { SetMetadata } from '@nestjs/common';

import { CUSTOM_REPOSITORY_METADATA } from '@/modules/database/constants';

export const CustomerRepository: <T>(entity: T) => ClassDecorator = <T>(entity: T) =>
    SetMetadata(CUSTOM_REPOSITORY_METADATA, entity);
