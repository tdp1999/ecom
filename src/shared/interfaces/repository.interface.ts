import { UUID } from '../types/general.type';
import { Pagination } from '../types/pagination.type';

export interface IRepositoryCommand<Create, Update> {
    create(data: Create): Promise<boolean>;
    update(id: UUID, data: Update): Promise<boolean>;
    delete(id: UUID): Promise<boolean>;
}

export interface IRepositoryQuery<T, Search> {
    list(query?: Search): Promise<T[]>;
    paginatedList(query?: Search): Promise<Pagination<T>>;
    findById(id: UUID): Promise<T | null>;
}