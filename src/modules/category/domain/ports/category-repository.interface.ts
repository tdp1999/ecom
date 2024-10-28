import { UUID } from '@shared/types/general.type';
import { Pagination } from '@shared/types/pagination.type';
import { CategoryCreateDto, CategorySearchDto, CategoryUpdateDto } from '../model/category.dto';
import { Category } from '../model/category.model';
import { IRepositoryCommand, IRepositoryQuery } from '@shared/interfaces/repository.interface';

export interface ICategoryRepositoryCommand extends IRepositoryCommand<CategoryCreateDto, CategoryUpdateDto> {
    create(category: Category, ancestorId?: UUID): Promise<boolean>;
}

export interface ICategoryRepositoryQuery extends IRepositoryQuery<Category, CategorySearchDto> {
    getFullTree(query?: CategorySearchDto): Promise<Category[]>;
    getFullTreeOfAncestor(id: UUID): Promise<Category | null>;
    hasChildren(category: Category): Promise<boolean>;
}

export interface ICategoryRepository extends ICategoryRepositoryCommand, ICategoryRepositoryQuery {}

export const CATEGORY_REPOSITORY_TOKEN = Symbol('ICategoryRepository');
