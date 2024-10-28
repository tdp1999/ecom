import { UUID } from '@shared/types/general.type';
import { Pagination } from '@shared/types/pagination.type';
import { CategorySearchDto, CategoryUpdateDto } from '../model/category.dto';
import { Category } from '../model/category.model';

export interface ICategoryRepositoryQuery {
    list(query?: CategorySearchDto): Promise<Category[]>;
    paginatedList(query?: CategorySearchDto): Promise<Pagination<Category>>;
    getFullTree(query?: CategorySearchDto): Promise<Category[]>;

    findById(id: UUID): Promise<Category | null>;
    hasChildren(category: Category): Promise<boolean>;
    getFullTreeOfAncestor(id: UUID): Promise<Category | null>;
}

export interface ICategoryRepositoryCommand {
    create(category: Category, ancestorId?: UUID): Promise<boolean>;
    update(id: UUID, data: CategoryUpdateDto): Promise<boolean>;
    delete(id: UUID): Promise<boolean>;
}

export interface ICategoryRepository extends ICategoryRepositoryQuery, ICategoryRepositoryCommand {}

export const CATEGORY_REPOSITORY_TOKEN = Symbol('ICategoryRepository');
