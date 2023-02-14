import { ElasticsearchModuleOptions } from '@nestjs/elasticsearch';

export const elastic = (): ElasticsearchModuleOptions => ({
    node: 'http://127.0.0.1:9200',
    maxRetries: 10,
    requestTimeout: 60000,
    pingTimeout: 60000,
    sniffOnStart: true,
});
