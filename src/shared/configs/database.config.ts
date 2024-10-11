import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    autoLoadEntities: true,
    synchronize: true,
    min: 2,
    max: 20,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
}));
