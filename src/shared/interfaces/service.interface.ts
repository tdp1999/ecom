import { SharedUser } from '@shared/types/user.shared.type';
import { Pagination } from '../types/pagination.type';
import { UUID } from './../types/general.type';

export interface IService<T, Create, Update, Search> {
    list(query?: Search): Promise<T[]>;

    paginatedList(query?: Search): Promise<Pagination<T>>;

    get(id: UUID): Promise<T | null>;

    exist(id: UUID): Promise<boolean>;

    create(payload: Create, user: SharedUser): Promise<UUID>;

    update(id: UUID, payload: Update, user: SharedUser): Promise<boolean>;

    delete(id: UUID, isHardDelete?: boolean): Promise<boolean>;
}
