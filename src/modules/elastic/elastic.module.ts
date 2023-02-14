import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticsearchModuleOptions } from '@nestjs/elasticsearch/dist/interfaces/elasticsearch-module-options.interface';
import { DynamicModule, Module } from '@nestjs/common';

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
