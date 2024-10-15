import { registerAs } from '@nestjs/config';
import { BaseDataSourceOptions } from 'typeorm/data-source/BaseDataSourceOptions';

export default registerAs(
    'database',
    (): BaseDataSourceOptions =>
        ({
            type: process.env.DB_TYPE,
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,

            autoLoadEntities: true,
            synchronize: false,
            logging: false,

            min: 2,
            max: 20,
            acquireTimeoutMillis: 30000,
            idleTimeoutMillis: 30000,
        }) as BaseDataSourceOptions,
);
