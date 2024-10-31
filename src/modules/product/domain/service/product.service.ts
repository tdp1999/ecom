import { Inject, Injectable, Optional } from '@nestjs/common';
import { IProductService } from '../ports/product-service.interface';
import { UUID } from '@shared/types/general.type';
import { Pagination } from '@shared/types/pagination.type';
import { Product } from '../model/product.model';
import {
    ProductCreateDto,
    ProductCreateSchema,
    ProductSearchDto,
    ProductSearchSchema,
    ProductUpdateDto,
    ProductUpdateSchema,
} from '../model/product.dto';
import { MODULE_IDENTIFIER } from '@shared/tokens/common.token';
import { IProductRepository, PRODUCT_REPOSITORY_TOKEN } from '../ports/product-repository.interface';
import { BadRequestError, NotFoundError } from '@shared/errors/domain-error';
import { formatZodError } from '@shared/errors/error-formatter';
import { v7 } from 'uuid';

@Injectable()
export class ProductService implements IProductService {
    constructor(
        @Optional() @Inject(MODULE_IDENTIFIER) private readonly moduleName: string = '',
        @Inject(PRODUCT_REPOSITORY_TOKEN) private readonly repository: IProductRepository,
    ) {}

    list(query?: ProductSearchDto): Promise<Product[]> {
        const { success, error, data } = ProductSearchSchema.safeParse(query);

        if (!success) {
            throw BadRequestError(formatZodError(error));
        }

        return this.repository.list(data);
    }

    paginatedList(query?: ProductSearchDto): Promise<Pagination<Product>> {
        const { success, error, data } = ProductSearchSchema.safeParse(query);

        if (!success) {
            throw BadRequestError(formatZodError(error));
        }

        return this.repository.paginatedList(data);
    }

    get(id: UUID): Promise<Product | null> {
        return this.getValidData(id);
    }

    async create(payload: ProductCreateDto): Promise<UUID> {
        const { success, error, data } = ProductCreateSchema.safeParse(payload);

        if (!success) {
            throw BadRequestError(formatZodError(error));
        }

        const id = v7();
        const currentTimestamp = BigInt(Date.now());
        const product: Product = {
            id,
            ...data,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        };

        await this.repository.create(product);

        return id;
    }

    async update(id: UUID, payload: ProductUpdateDto): Promise<boolean> {
        const { success, error, data } = ProductUpdateSchema.safeParse(payload);

        if (!success) {
            throw BadRequestError(formatZodError(error));
        }

        await this.getValidData(id);
        return this.repository.update(id, data);
    }

    async delete(id: UUID, isHardDelete?: boolean): Promise<boolean> {
        await this.getValidData(id);

        if (isHardDelete) {
            return this.repository.delete(id);
        }

        return this.repository.update(id, { deletedAt: BigInt(Date.now()) });
    }

    private async getValidData(id: UUID): Promise<Product> {
        const data = await this.repository.findById(id);

        if (!data || !!data.deletedAt) throw NotFoundError(`${this.moduleName} with id ${id} not found`);

        return data;
    }
}
