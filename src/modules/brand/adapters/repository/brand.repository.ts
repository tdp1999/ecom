import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudRepository } from '@shared/abstractions/repository.base';
import { FindOptionsWhere, ILike, IsNull, Repository } from 'typeorm';
import { BrandCreateDto, BrandSearchDto, BrandUpdateDto } from '../../domain/model/brand.dto';
import { Brand } from '../../domain/model/brand.model';
import { IBrandRepository } from '../../domain/ports/brand-repository.interface';
import { BrandEntity } from './brand.entity';

@Injectable()
export class BrandRepository
    extends BaseCrudRepository<BrandEntity, BrandCreateDto, BrandUpdateDto, BrandSearchDto>
    implements IBrandRepository
{
    constructor(@InjectRepository(BrandEntity) repository: Repository<BrandEntity>) {
        super(repository);
    }

    async findByConditions(conditions: Record<string, any>, visibleColumns?: (keyof Brand)[]): Promise<Brand | null> {
        const where = this.buildWhereConditions(conditions);
        return await this.repository.findOne({
            where,
            ...(visibleColumns && visibleColumns.length && { select: visibleColumns }),
        });
    }

    protected buildWhereConditions(query?: BrandSearchDto): FindOptionsWhere<BrandEntity> {
        const { ...filters } = query || {};

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
}
