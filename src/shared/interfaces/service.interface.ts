import { Pagination } from '../types/pagination.type';
import { UUID } from './../types/general.type';

export interface IService<T, Create, Update, Search> {
    list(query?: Search): Promise<T[]>;
    paginatedList(query?: Search): Promise<Pagination<T>>;
    get(id: UUID): Promise<T | null>;
    create(payload: Create): Promise<UUID>;
    update(id: UUID, payload: Update): Promise<boolean>;
    delete(id: UUID, isHardDelete?: boolean): Promise<boolean>;
}
