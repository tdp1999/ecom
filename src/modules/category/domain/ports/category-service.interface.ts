import { UUID } from '@shared/types/general.type';
import { Pagination } from '@shared/types/pagination.type';
import { CategoryCreateDto, CategorySearchDto, CategoryUpdateDto } from '../model/category.dto';
import { Category } from '../model/category.model';

export interface ICategoryService {
    list(query?: CategorySearchDto): Promise<Category[]>;
    paginatedList(query?: CategorySearchDto): Promise<Pagination<Category>>;
    getFullTree(query?: CategorySearchDto): Promise<Category[]>;
    get(id: UUID): Promise<Category | null>;
    create(payload: CategoryCreateDto): Promise<UUID>;
    update(id: UUID, payload: CategoryUpdateDto): Promise<boolean>;
    delete(id: UUID, isHardDelete?: boolean): Promise<boolean>;
}

export const CATEGORY_SERVICE_TOKEN = Symbol('ICategoryService');
