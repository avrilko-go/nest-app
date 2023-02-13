import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';

export const database: () => TypeOrmModuleOptions = () => ({
    type: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    username: 'postgres',
    password: '123456',
    database: 'postgres',
    charset: 'utf8mb4',
    synchronize: true,
    autoLoadEntities: true,
    schema: 'avrilko',
});
