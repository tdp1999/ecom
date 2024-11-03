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
import {
    IProductBrandRepository,
    IProductCategoryRepository,
    IProductRepository,
    PRODUCT_REPOSITORY_TOKEN,
} from '../ports/product-repository.interface';
import { BaseCrudService } from '@shared/abstractions/service.base';
import { UUID } from '@shared/types/general.type';
import { Product, ProductBrandSchema, ProductCategoryListSchema } from '@product/domain/model/product.model';
import { PRODUCT_BRAND_REPOSITORY_TOKEN, PRODUCT_CATEGORY_REPOSITORY_TOKEN } from '@product/domain/model/product.token';
import { BadRequestError } from '@shared/errors/domain-error';
import { formatZodError } from '@shared/errors/error-formatter';

@Injectable()
export class ProductService
    extends BaseCrudService<Product, ProductCreateDto, ProductUpdateDto, ProductSearchDto>
    implements IProductService
{
    protected createSchema = ProductCreateSchema;
    protected updateSchema = ProductUpdateSchema;
    protected searchSchema = ProductSearchSchema;

    constructor(
        @Optional() @Inject(MODULE_IDENTIFIER) protected readonly moduleName: string = '',
        @Inject(PRODUCT_REPOSITORY_TOKEN) protected readonly repository: IProductRepository,
        @Inject(PRODUCT_BRAND_REPOSITORY_TOKEN) private readonly brandRepository: IProductBrandRepository,
        @Inject(PRODUCT_CATEGORY_REPOSITORY_TOKEN) private readonly categoryRepository: IProductCategoryRepository,
    ) {
        super(moduleName, repository);
    }

    override async get(id: UUID): Promise<Product | null> {
        const product = await this.getValidData(id);

        // Get brand
        if (product.brandId) {
            const brand = await this.brandRepository.get(product.brandId);
            const { success, data, error } = ProductBrandSchema.safeParse(brand);

            if (!success) {
                throw BadRequestError(formatZodError(error));
            }

            product.brand = data;
        }

        // Get categories
        if (product.categoryIds) {
            const categories = await Promise.all(product.categoryIds.map((id) => this.categoryRepository.get(id)));
            const { success, data, error } = ProductCategoryListSchema.safeParse(categories);

            if (!success) {
                throw BadRequestError(formatZodError(error));
            }

            product.categories = data.filter((category) => category !== null);
        }

        return product;
    }

    protected validateCreate(): Promise<void> {
        return Promise.resolve();
    }

    protected validateUpdate(): Promise<void> {
        return Promise.resolve();
    }
}
