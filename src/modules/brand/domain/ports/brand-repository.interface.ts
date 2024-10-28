import { IRepositoryCommand, IRepositoryQuery } from '@shared/interfaces/repository.interface';
import { BrandCreateDto, BrandSearchDto, BrandUpdateDto } from '../model/brand.dto';
import { Brand } from '../model/brand.model';

export interface IBrandRepository
    extends IRepositoryQuery<Brand, BrandSearchDto>,
        IRepositoryCommand<BrandCreateDto, BrandUpdateDto> {}

export const BRAND_REPOSITORY_TOKEN = Symbol('IBrandRepository');
