import { IService } from '@shared/interfaces/service.interface';
import { Brand } from '../model/brand.model';
import { BrandCreateDto, BrandSearchDto, BrandUpdateDto } from '../model/brand.dto';

export interface IBrandService extends IService<Brand, BrandCreateDto, BrandUpdateDto, BrandSearchDto> {}
export const BRAND_SERVICE_TOKEN = Symbol('IBrandService');
