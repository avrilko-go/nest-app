import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';

export const database: () => TypeOrmModuleOptions = () => ({
    type: 'mysql',
    host: '172.17.22.37',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'avrilko',
    charset: 'utf8mb4',
    synchronize: true,
    autoLoadEntities: true,
});
