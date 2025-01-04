import { SharedUser } from '@shared/types/user.shared.type';
import { Pagination } from '../types/pagination.type';
import { UUID } from './../types/general.type';

export interface IService<T, Create, Update, Search> {
    list(query?: Search): Promise<T[]>;

    paginatedList(query?: Search): Promise<Pagination<T>>;

    get(id: UUID, visibleColumns?: (keyof T)[]): Promise<T | null>;

    exist(id: UUID): Promise<boolean>;

    existAndValid(id: UUID): Promise<boolean>;

    create(user: SharedUser, payload: Create): Promise<UUID>;

    update(user: SharedUser, id: UUID, payload: Update): Promise<boolean>;

    delete(user: SharedUser, id: UUID, isHardDelete?: boolean): Promise<boolean>;
}
