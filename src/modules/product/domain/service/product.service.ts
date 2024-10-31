import { Inject, Injectable, Optional } from '@nestjs/common';
import { IProductService } from '../ports/product-service.interface';
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
import { BaseCrudService } from '@shared/abstractions/service.base';
import { ProductEntity } from '@product/adapters/repository/product.entity';

@Injectable()
export class ProductService
    extends BaseCrudService<ProductEntity, ProductCreateDto, ProductUpdateDto, ProductSearchDto>
    implements IProductService
{
    protected createSchema = ProductCreateSchema;
    protected updateSchema = ProductUpdateSchema;
    protected searchSchema = ProductSearchSchema;

    constructor(
        @Optional() @Inject(MODULE_IDENTIFIER) protected readonly moduleName: string = '',
        @Inject(PRODUCT_REPOSITORY_TOKEN) protected readonly repository: IProductRepository,
    ) {
        super(moduleName, repository);
    }

    protected validateCreate(): Promise<void> {
        return Promise.resolve();
    }

    protected validateUpdate(): Promise<void> {
        return Promise.resolve();
    }
}
