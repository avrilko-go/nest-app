import { DynamicModule, Module } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostService } from '@/modules/content/services/post.service';
import { SearchService } from '@/modules/content/services/search.service';
import { PostSubscriber } from '@/modules/content/subscribers';
import { DatabaseModule } from '@/modules/database/database.module';

import { ContentConfig } from '@/modules/database/types';

import * as controllers from './controllers';
import * as entities from './entities';
import * as repositories from './repositories';
import { CategoryRepository, PostRepository } from './repositories';
import * as services from './services';
import { CategoryService } from './services';

@Module({
    imports: [
        TypeOrmModule.forFeature(Object.values(entities)),
        DatabaseModule.forRepository(Object.values(repositories)),
    ],
    controllers: Object.values(controllers),
    providers: [...Object.values(services), PostSubscriber],
    exports: [
        ...Object.values(services),
        DatabaseModule.forRepository(Object.values(repositories)),
    ],
})
export class ContentModule {
    static forRoot(configRegister?: () => ContentConfig): DynamicModule {
        const config: Required<ContentConfig> = {
            searchType: 'against',
            ...(configRegister ? configRegister() : {}),
        };

        const providers: ModuleMetadata['providers'] = [
            ...Object.values(services),
            PostSubscriber,
            {
                provide: PostService,
                inject: [
                    PostRepository,
                    CategoryService,
                    CategoryRepository,
                    { token: SearchService, optional: true },
                ],
                useFactory: (
                    postRepository: PostRepository,
                    categoryService: CategoryService,
                    categoryRepository: CategoryRepository,
                    searchService?: SearchService,
                ) =>
                    new PostService(
                        postRepository,
                        categoryService,
                        categoryRepository,
                        searchService,
                        config.searchType,
                    ),
            },
        ];

        if (config.searchType === 'elastic') {
            providers.push(SearchService);
        }

        return {
            module: ContentModule,
            providers,
            controllers: Object.values(controllers),
            imports: [
                TypeOrmModule.forFeature(Object.values(entities)),
                DatabaseModule.forRepository(Object.values(repositories)),
            ],
            exports: [
                ...Object.values(services),
                DatabaseModule.forRepository(Object.values(repositories)),
                PostService,
            ],
        };
    }
}
