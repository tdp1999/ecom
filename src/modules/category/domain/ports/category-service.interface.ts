import { IService } from '@shared/interfaces/service.interface';
import { CategoryCreateDto, CategorySearchDto, CategoryUpdateDto } from '../model/category.dto';
import { Category } from '../model/category.model';

export interface ICategoryService extends IService<Category, CategoryCreateDto, CategoryUpdateDto, CategorySearchDto> {
    getFullTree(query?: CategorySearchDto): Promise<Category[]>;
}

export const CATEGORY_SERVICE_TOKEN = Symbol('ICategoryService');
