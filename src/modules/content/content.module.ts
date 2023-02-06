import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostController } from '@/modules/content/controllers';

import { PostService, SanitizeService } from '@/modules/content/services';
import { PostSubscriber } from '@/modules/content/subscribers';
import { DatabaseModule } from '@/modules/database/database.module';

import * as entities from './entities';
import * as repositories from './repositories';

@Module({
    imports: [
        TypeOrmModule.forFeature(Object.values(entities)),
        DatabaseModule.forRepository(Object.values(repositories)),
    ],
    controllers: [PostController],
    providers: [PostService, SanitizeService, PostSubscriber],
    exports: [PostService, DatabaseModule.forRepository(Object.values(repositories))],
})
export class ContentModule {}
