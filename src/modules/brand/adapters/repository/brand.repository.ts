import { Injectable } from '@nestjs/common';
import { UUID } from '@shared/types/general.type';
import { Pagination } from '@shared/types/pagination.type';
import { BrandCreateDto, BrandSearchDto, BrandUpdateDto } from '../../domain/model/brand.dto';
import { Brand } from '../../domain/model/brand.model';
import { IBrandRepository } from '../../domain/ports/brand-repository.interface';
import { BrandEntity } from './brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, IsNull, Repository } from 'typeorm';

@Injectable()
export class BrandRepository implements IBrandRepository {
    constructor(@InjectRepository(BrandEntity) private repository: Repository<BrandEntity>) {}

    async list(query?: BrandSearchDto): Promise<Brand[]> {
        const { orderBy, orderType } = query || {};
        const items = await this.repository.find({
            where: this.buildWhereConditions(query),
            order: this.buildOrderConditions({ orderBy, orderType }),
        });
        return items;
    }

    async paginatedList(query?: BrandSearchDto): Promise<Pagination<Brand>> {
        throw new Error('Method not implemented.');
    }

    async findById(id: UUID): Promise<Brand | null> {
        throw new Error('Method not implemented.');
    }

    private buildWhereConditions(query?: BrandSearchDto) {
        const { limit = 10, page = 1, ...filters } = query || {};

        // Build search conditions dynamically
        const where: FindOptionsWhere<Brand> = {
            deletedAt: IsNull(),
        };

        if (filters.name) {
            where.name = ILike(`%${filters.name}%`); // Fuzzy search
        }

        if (filters.tagLine) {
            where.tagLine = ILike(`%${filters.tagLine}%`);
        }

        if (filters.status) {
            where.status = filters.status;
        }

        return where;
    }

    private buildOrderConditions(query?: BrandSearchDto) {
        const { orderBy, orderType } = query || {};

        if (!orderBy || !orderType) {
            return {};
        }

        return {
            [orderBy]: orderType.toUpperCase() === 'ASC' ? 'ASC' : 'DESC', // Ensure correct order type
        };
    }

    async create(data: BrandCreateDto): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    async update(id: UUID, data: BrandUpdateDto): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    async delete(id: UUID): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
}
