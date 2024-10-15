import { DataSource } from 'typeorm';
import { getEntityPaths, getMigrationPaths } from '../utils/path';

require('dotenv').config();

export default new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    synchronize: false,
    logging: false,

    entities: getEntityPaths(process.env.TYPEORM_ENTITIES),
    migrations: getMigrationPaths(process.env.TYPEORM_MIGRATIONS),
    migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
});
