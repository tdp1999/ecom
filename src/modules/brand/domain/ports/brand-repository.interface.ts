import { IRepositoryCommand, IRepositoryQuery } from '@shared/interfaces/repository.interface';
import { BrandCreateDto, BrandSearchDto, BrandUpdateDto } from '../model/brand.dto';
import { Brand } from '../model/brand.model';
import { UUID } from '@shared/types/general.type';

export interface IBrandRepository
    extends IRepositoryQuery<Brand, BrandSearchDto>,
        IRepositoryCommand<BrandCreateDto, BrandUpdateDto> {
    findByIds(ids: UUID[]): Promise<Brand[]>;
}

export const BRAND_REPOSITORY_TOKEN = Symbol('IBrandRepository');
