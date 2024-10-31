import { IService } from '@shared/interfaces/service.interface';
import { Brand } from '../model/brand.model';
import { BrandCreateDto, BrandFindOneDto, BrandSearchDto, BrandUpdateDto } from '../model/brand.dto';

export interface IBrandService extends IService<Brand, BrandCreateDto, BrandUpdateDto, BrandSearchDto> {
    getByConditions(conditions?: BrandFindOneDto): Promise<Brand | null>;
}

export const BRAND_SERVICE_TOKEN = Symbol('IBrandService');
