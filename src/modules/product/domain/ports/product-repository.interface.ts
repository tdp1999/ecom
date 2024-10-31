import { IRepositoryCommand, IRepositoryQuery } from '@shared/interfaces/repository.interface';
import { Product } from '../model/product.model';
import { ProductCreateDto, ProductSearchDto, ProductUpdateDto } from '../model/product.dto';

export interface IProductRepositoryQuery extends IRepositoryQuery<Product, ProductSearchDto> {}

export interface IProductRepositoryCommand extends IRepositoryCommand<ProductCreateDto, ProductUpdateDto> {}

export interface IProductRepository extends IProductRepositoryQuery, IProductRepositoryCommand {}

export const PRODUCT_REPOSITORY_TOKEN = Symbol('IProductRepository');
