import { IRepositoryCommand, IRepositoryQuery } from '@shared/interfaces/repository.interface';
import { Product, ProductBrand, ProductCategory } from '../model/product.model';
import { ProductCreateDto, ProductSearchDto, ProductUpdateDto } from '../model/product.dto';
import { UUID } from '@shared/types/general.type';

export interface IProductRepositoryQuery
    extends IRepositoryQuery<Omit<Product, 'brand' | 'categories'>, ProductSearchDto> {}

export interface IProductRepositoryCommand extends IRepositoryCommand<ProductCreateDto, ProductUpdateDto> {}

export interface IProductRepository extends IProductRepositoryQuery, IProductRepositoryCommand {}

export interface IProductBrandRepository {
    get(id: UUID): Promise<ProductBrand | null>;

    load(id: UUID): Promise<ProductBrand | null>;

    getByIds(ids: UUID[]): Promise<(ProductBrand | null)[]>;

    exist(id: UUID): Promise<boolean>;
}

export interface IProductCategoryRepository {
    get(id: UUID): Promise<ProductCategory | null>;

    load(id: UUID): Promise<ProductCategory | null>;

    getByIds(ids: UUID[]): Promise<(ProductCategory | null)[]>;

    exist(id: UUID): Promise<boolean>;
}

export const PRODUCT_REPOSITORY_TOKEN = Symbol('IProductRepository');
