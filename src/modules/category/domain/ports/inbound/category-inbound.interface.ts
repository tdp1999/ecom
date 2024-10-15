import { UUID } from '@shared/types/general.type';
import { CategoryCreateDto, CategorySearchDto, CategoryUpdateDto } from '../../model/category.dto';
import { Category } from '../../model/category.model';

export interface ICategoryService {
    create(payload: CategoryCreateDto): Promise<UUID>;
    get(id: UUID): Promise<Category | null>;
    list(query?: CategorySearchDto): Promise<Category[]>;
    update(id: UUID, payload: CategoryUpdateDto): Promise<boolean>;
    delete(id: UUID): Promise<boolean>;
}

export const CATEGORY_SERVICE_TOKEN = Symbol('ICategoryService');
