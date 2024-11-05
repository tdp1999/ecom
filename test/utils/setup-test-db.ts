import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({ path: '.env.test' });

export const testConfig: TypeOrmModuleOptions = {
    type: 'mysql',

    // host: process.env.DB_HOST,
    // username: process.env.DB_USERNAME,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,
    // port: Number(process.env.DB_PORT),

    host: 'localhost',
    username: 'test_user',
    password: 'test_password',
    database: 'ecom_test_db',
    port: 5433,

    synchronize: true, // Be careful with this in production
    dropSchema: true, // This will drop the schema before each test run

    entities: ['src/**/*.entity.ts'],
    migrations: ['test/migrations/*.ts'],
    migrationsRun: true,
};

export class TestUtils {
    private static dataSource: DataSource;

    static async createTestingModule(imports: any[]) {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: '.env.test',
                }),
                TypeOrmModule.forRoot(testConfig),
                ...imports,
            ],
        }).compile();

        const app = module.createNestApplication();
        await app.init();

        TestUtils.dataSource = module.get(DataSource);
        return { app, module };
    }

    static async clearDatabase() {
        const entities = TestUtils.dataSource.entityMetadatas;
        for (const entity of entities) {
            const repository = TestUtils.dataSource.getRepository(entity.name);
            await repository.query(`TRUNCATE "${entity.tableName}" CASCADE;`);
        }
    }
}
