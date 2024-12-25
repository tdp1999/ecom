import { Inject, Injectable, Optional } from '@nestjs/common';
import {
    ERR_PRODUCT_BRAND_ID_MUST_BE_VALID_UUID,
    ERR_PRODUCT_CATEGORY_ID_MUST_BE_VALID_UUID,
} from '@product/domain/model/product.error';
import { Product, ProductBrandSchema, ProductCategoryListSchema } from '@product/domain/model/product.model';
import { PRODUCT_BRAND_REPOSITORY_TOKEN, PRODUCT_CATEGORY_REPOSITORY_TOKEN } from '@product/domain/model/product.token';
import { BaseCrudService } from '@shared/abstractions/service.base';
import { BadRequestError } from '@shared/errors/domain-error';
import { formatZodError } from '@shared/errors/error-formatter';
import { MODULE_IDENTIFIER } from '@shared/tokens/common.token';
import { UUID } from '@shared/types/general.type';
import { Pagination } from '@shared/types/pagination.type';
import {
    ProductCreateDto,
    ProductCreateSchema,
    ProductSearchDto,
    ProductSearchSchema,
    ProductUpdateDto,
    ProductUpdateSchema,
} from '../model/product.dto';
import {
    IProductBrandRepository,
    IProductCategoryRepository,
    IProductRepository,
    PRODUCT_REPOSITORY_TOKEN,
} from '../ports/product-repository.interface';
import { IProductService } from '../ports/product-service.interface';

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

    override async list(query: ProductSearchDto): Promise<Product[]> {
        const { success, error, data } = this.searchSchema.safeParse(query);

        if (!success) throw this.handleValidationError(error);

        const products = await this.repository.list(data);

        await this.loadProductRelations(products);

        return products;
    }

    override async paginatedList(query?: ProductSearchDto): Promise<Pagination<Product>> {
        const { success, error, data } = this.searchSchema.safeParse(query);

        if (!success) throw this.handleValidationError(error);

        const result = await this.repository.paginatedList(data);

        await this.loadProductRelations(result.items);

        return result;
    }

    // TODO: Check if brand and categories are deleted
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

    // Protected methods
    protected async validateCreate(data: ProductCreateDto): Promise<void> {
        const { brandId, categoryIds } = data;

        // Check if brand exists
        if (brandId) {
            const brand = await this.brandRepository.exist(brandId);
            if (!brand) {
                throw BadRequestError(ERR_PRODUCT_BRAND_ID_MUST_BE_VALID_UUID.message);
            }
        }

        // Check if category exists
        if (categoryIds) {
            const categories = await Promise.all(categoryIds.map((id_1) => this.categoryRepository.exist(id_1)));
            if (categories.some((category) => !category)) {
                throw BadRequestError(ERR_PRODUCT_CATEGORY_ID_MUST_BE_VALID_UUID.message);
            }
        }
    }

    protected async validateUpdate(): Promise<void> {
        return Promise.resolve();
    }

    // Private methods
    private async loadProductRelations(products: Product[]): Promise<void> {
        try {
            await Promise.all(
                products.flatMap((product) =>
                    [
                        // Load brand
                        product.brandId &&
                            this.brandRepository.load(product.brandId).then((brand) => {
                                product.brand = brand || null;
                            }),

                        // Load category
                        product.categoryIds?.length &&
                            this.categoryRepository.getByIds(product.categoryIds).then((categories) => {
                                product.categories = categories.filter((category) => !!category);
                            }),
                    ].filter(Boolean),
                ),
            ); // Filter out null promises
        } catch (error) {
            throw new Error(`Failed to load relations: ${error.message}`);
        }
    }
}
