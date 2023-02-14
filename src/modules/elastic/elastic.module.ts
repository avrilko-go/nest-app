import { DynamicModule, Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticsearchModuleOptions } from '@nestjs/elasticsearch/dist/interfaces/elasticsearch-module-options.interface';

@Module({})
export class ElasticModule {
    static forRoot(elasticsearch: () => ElasticsearchModuleOptions): DynamicModule {
        return {
            global: true,
            module: ElasticModule,
            imports: [ElasticsearchModule.register(elasticsearch())],
            exports: [ElasticsearchModule],
        };
    }
}
