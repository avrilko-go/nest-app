import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';

export const database: () => TypeOrmModuleOptions = () => ({
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'avrilko',
    charset: 'utf8mb4',
    synchronize: true,
    autoLoadEntities: true,
});
