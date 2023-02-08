import { DynamicModule, Module, Provider } from '@nestjs/common';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';

import { DataSource } from 'typeorm';

import { CUSTOM_REPOSITORY_METADATA } from '@/modules/database/constants';
import {
    DataExistConstraint,
    UniqueConstraint,
    UniqueExistContraint,
    UniqueTreeConstraint,
    UniqueTreeExistConstraint,
} from '@/modules/database/constraints';

@Module({})
export class DatabaseModule {
    static forRoot(database: () => TypeOrmModuleOptions): DynamicModule {
        return {
            global: true,
            module: DatabaseModule,
            imports: [TypeOrmModule.forRoot(database())],
            providers: [
                DataExistConstraint,
                UniqueTreeConstraint,
                UniqueTreeExistConstraint,
                UniqueConstraint,
                UniqueExistContraint,
            ],
        };
    }

    static forRepository(repositories: any[], dataSourceName?: string): DynamicModule {
        const providers: Provider[] = [];

        for (const Repo of repositories) {
            const entity = Reflect.getMetadata(CUSTOM_REPOSITORY_METADATA, Repo);
            if (!entity) {
                continue;
            }

            providers.push({
                inject: [getDataSourceToken(dataSourceName)],
                provide: Repo,
                useFactory: (dataSource: DataSource) => {
                    const base = dataSource.getRepository(entity);
                    return new Repo(base.target, base.manager, base.queryRunner);
                },
            });
        }

        return {
            exports: providers,
            module: DatabaseModule,
            providers,
        };
    }
}
