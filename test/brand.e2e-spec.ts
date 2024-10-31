import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BrandCreateDto, BrandUpdateDto } from '@brand/domain/model/brand.dto';
import { BrandEntity } from '@brand/adapters/repository/brand.entity';
import { STATUS } from '@shared/enums/status.enum';

describe('Brand CRUD (e2e)', () => {
    let app: INestApplication;
    let brandRepo: Repository<BrandEntity>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        brandRepo = moduleFixture.get<Repository<BrandEntity>>(getRepositoryToken(BrandEntity));
    });

    afterAll(async () => {
        await app.close();
    });

    let brandId: string;

    // 1. CREATE a new Brand
    it('/POST brand - create', async () => {
        const createDto: BrandCreateDto = {
            name: 'Test Brand',
            tagLine: 'Quality over quantity',
            status: STATUS.ACTIVE,
        };

        const response = await request(app.getHttpServer()).post('/brand').send(createDto).expect(201);

        expect(response.body).toHaveProperty('id');
        brandId = response.body.id;
    });

    // 2. GET Brand List
    it('/GET brand/list - list all brands', async () => {
        const response = await request(app.getHttpServer()).get('/brand/list').expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    // 3. GET Brand by ID
    it('/GET brand/:id - get one brand by ID', async () => {
        const response = await request(app.getHttpServer()).get(`/brand/${brandId}`).expect(200);

        expect(response.body).toHaveProperty('name', 'Test Brand');
        expect(response.body).toHaveProperty('id', brandId);
    });

    // 4. UPDATE Brand by ID
    it('/PATCH brand/:id - update a brand by ID', async () => {
        const updateDto: BrandUpdateDto = {
            name: 'Updated Brand Name',
        };

        await request(app.getHttpServer()).patch(`/brand/${brandId}`).send(updateDto).expect(200);

        const updatedBrand = await brandRepo.findOneBy({ id: brandId });
        expect(updatedBrand).toHaveProperty('name', 'Updated Brand Name');
    });

    // 5. DELETE Brand by ID
    it('/DELETE brand/:id - delete a brand by ID', async () => {
        await request(app.getHttpServer()).delete(`/brand/${brandId}`).expect(200);

        const deletedBrand = await brandRepo.findOneBy({ id: brandId });
        expect(deletedBrand).toBeNull();
    });
});
