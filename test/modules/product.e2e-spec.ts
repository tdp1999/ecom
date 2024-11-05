import { INestApplication } from '@nestjs/common';
import { TestUtils } from '../utils/setup-test-db';
import { DataSource } from 'typeorm';

describe('Product (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    beforeAll(async () => {
        const testingModule = await TestUtils.createTestingModule([]);
        app = testingModule.app;
        dataSource = testingModule.module.get<DataSource>(DataSource);
    });

    beforeEach(async () => {
        await TestUtils.clearDatabase();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be defined', () => {
        expect(app).toBeDefined();
    });

    it('should connect to the database', async () => {
        expect(dataSource.isInitialized).toBeTruthy();
    });

    it('should be able to query the database', async () => {
        const result = await dataSource.query('SELECT 1 as number');
        expect(result[0].number).toBe(1);
    });
});
