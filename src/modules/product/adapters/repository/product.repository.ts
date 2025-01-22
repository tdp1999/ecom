import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudRepository } from '@shared/abstractions/repository.base';
import { FindOptionsWhere, ILike, IsNull, Repository } from 'typeorm';
import { ProductCreateDto, ProductSearchDto, ProductUpdateDto } from '../../domain/model/product.dto';
import { Product } from '../../domain/model/product.model';
import { IProductRepository } from '../../domain/ports/product-repository.interface';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductRepository
    extends BaseCrudRepository<ProductEntity, ProductCreateDto, ProductUpdateDto, ProductSearchDto>
    implements IProductRepository
{
    constructor(@InjectRepository(ProductEntity) protected repository: Repository<ProductEntity>) {
        super(repository);
    }

    protected buildWhereConditions(query?: ProductSearchDto): FindOptionsWhere<ProductEntity> {
        const { ...filters } = query || {};

        // Build search conditions dynamically
        const where: FindOptionsWhere<Product> = {
            deletedAt: IsNull(),
        };

        if (filters.name) {
            where.name = ILike(`%${filters.name}%`); // Fuzzy search
        }

        if (filters.status) {
            where.status = filters.status;
        }

        return where;
    }

    //
    // public async findAndLockById(id: UUID): Promise<Product> {
    //     const entity = await this.repository.createQueryBuilder().setLock('pessimistic_write')
    // }
}
