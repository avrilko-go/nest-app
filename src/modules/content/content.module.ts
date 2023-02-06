import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostController } from '@/modules/content/controllers';
import { PostEntity } from '@/modules/content/entities';
import { PostRepository } from '@/modules/content/repositories/post.repository';
import { PostService, SanitizeService } from '@/modules/content/services';
import { DatabaseModule } from '@/modules/database/database.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([PostEntity]),
        DatabaseModule.forRepository([PostRepository]),
    ],
    controllers: [PostController],
    providers: [PostService, SanitizeService],
    exports: [PostService, DatabaseModule.forRepository([PostRepository])],
})
export class ContentModule {}
