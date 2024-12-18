import { IRepositoryCommand, IRepositoryQuery } from '@shared/interfaces/repository.interface';
import { UUID } from '@shared/types/general.type';
import { CategoryCreateDto, CategorySearchDto, CategoryUpdateDto } from '../model/category.dto';
import { Category } from '../model/category.model';

export interface ICategoryRepositoryCommand extends IRepositoryCommand<CategoryCreateDto, CategoryUpdateDto> {
    create(category: Category, ancestorId?: UUID): Promise<boolean>;
}

export interface ICategoryRepositoryQuery extends IRepositoryQuery<Category, CategorySearchDto> {
    findByIds(ids: UUID[]): Promise<Category[]>;
    getFullTree(query?: CategorySearchDto): Promise<Category[]>;
    getFullTreeOfAncestor(id: UUID): Promise<Category | null>;
    hasChildren(category: Category): Promise<boolean>;
}

export interface ICategoryRepository extends ICategoryRepositoryCommand, ICategoryRepositoryQuery {}

export const CATEGORY_REPOSITORY_TOKEN = Symbol('ICategoryRepository');
