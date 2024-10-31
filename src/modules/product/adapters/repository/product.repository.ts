import { Injectable } from '@nestjs/common';
import { IProductRepository } from '../../domain/ports/product-repository.interface';
import { UUID } from '@shared/types/general.type';
import { Pagination } from '@shared/types/pagination.type';
import { Product } from '../../domain/model/product.model';
import { ProductCreateDto, ProductSearchDto, ProductUpdateDto } from '../../domain/model/product.dto';
import { FindOptionsWhere, ILike, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductRepository implements IProductRepository {
    constructor(@InjectRepository(ProductEntity) private repository: Repository<ProductEntity>) {}

    async list(query?: ProductSearchDto): Promise<Product[]> {
        const { orderBy, orderType } = query || {};
        return await this.repository.find({
            where: this.buildWhereConditions(query),
            order: this.buildOrderConditions({ orderBy, orderType }),
        });
    }

    async paginatedList(query?: ProductSearchDto): Promise<Pagination<Product>> {
        const { limit = 10, page = 1, orderBy, orderType } = query || {};

        const [items, total] = await this.repository.findAndCount({
            where: this.buildWhereConditions(query),
            take: limit,
            skip: (page - 1) * limit,
            order: this.buildOrderConditions({ orderBy, orderType }),
        });

        const totalPages = Math.ceil(total / limit);

        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    }

    async findById(id: UUID): Promise<Product | null> {
        return await this.repository.findOneBy({ id });
    }

    async create(data: ProductCreateDto): Promise<boolean> {
        await this.repository.create(data).save();
        return true;
    }

    async update(id: UUID, data: ProductUpdateDto): Promise<boolean> {
        await this.repository.update(id, data);
        return true;
    }

    async delete(id: UUID): Promise<boolean> {
        await this.repository.delete(id);
        return true;
    }

    /* Helper Functions */
    private buildWhereConditions(query?: ProductSearchDto) {
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

    private buildOrderConditions(query?: ProductSearchDto) {
        const { orderBy, orderType } = query || {};

        if (!orderBy || !orderType) {
            return {};
        }

        return {
            [orderBy]: orderType.toUpperCase() === 'ASC' ? 'ASC' : 'DESC', // Ensure correct order type
        };
    }
}
