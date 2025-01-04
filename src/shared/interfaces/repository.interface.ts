import { UUID } from '../types/general.type';
import { Pagination } from '../types/pagination.type';

export interface IRepositoryCommand<Create, Update> {
    create(data: Create): Promise<boolean>;

    update(id: UUID, data: Update): Promise<boolean>;

    delete(id: UUID): Promise<boolean>;
}

export interface IRepositoryQuery<T, Search, Conditions = Record<string, any>> {
    list(query?: Search, visibleColumns?: (keyof T)[]): Promise<T[]>;

    paginatedList(query?: Search, visibleColumns?: (keyof T)[]): Promise<Pagination<T>>;

    findById(id: UUID, visibleColumns?: (keyof T)[]): Promise<T | null>;

    findByIds(ids: UUID[], visibleColumns?: (keyof T)[]): Promise<T[]>;

    exist(id: UUID): Promise<boolean>;

    existAndNotDeleted(id: UUID): Promise<boolean>;

    findByConditions?(conditions: Conditions, visibleColumns?: (keyof T)[]): Promise<T | null>;
}
