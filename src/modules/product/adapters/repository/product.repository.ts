import { Injectable } from '@nestjs/common';
import { IProductRepository } from '../../domain/ports/product-repository.interface';
import { Product } from '../../domain/model/product.model';
import { ProductCreateDto, ProductSearchDto, ProductUpdateDto } from '../../domain/model/product.dto';
import { FindOptionsWhere, ILike, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { BaseCrudRepository } from '@shared/abstractions/repository.base';

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
}
