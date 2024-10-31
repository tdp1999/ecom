import { IService } from '@shared/interfaces/service.interface';
import { Product } from '../model/product.model';
import { ProductCreateDto, ProductSearchDto, ProductUpdateDto } from '../model/product.dto';

export interface IProductService extends IService<Product, ProductCreateDto, ProductUpdateDto, ProductSearchDto> {}

export const PRODUCT_SERVICE_TOKEN = Symbol('IProductService');
