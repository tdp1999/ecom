import { UUID } from '@shared/types/general.type';
import { Pagination } from '@shared/types/pagination.type';
import { Address, IAddress } from '../../domain/address.model';
import { AddressQueryDto, AddressViewDto } from '../dtos/address.dto';

export interface IAddressCommandRepository {
    add(address: Address): Promise<boolean>;

    update(id: UUID, address: Address): Promise<boolean>;

    remove(id: UUID): Promise<boolean>;
}

export interface IAddressQueryRepository {
    findById(id: UUID, columns?: (keyof IAddress)[]): Promise<AddressViewDto | null>;

    getById(id: UUID, columns?: (keyof IAddress)[]): Promise<AddressViewDto>;

    exists(id: UUID): Promise<boolean>;

    existAndNotDeleted(id: UUID): Promise<boolean>;

    list(query?: AddressQueryDto, columns?: (keyof IAddress)[]): Promise<AddressViewDto[]>;

    paginatedList(query?: AddressQueryDto, columns?: (keyof IAddress)[]): Promise<Pagination<AddressViewDto>>;

    // For Internal Use
    retrieveById(id: UUID): Promise<Address | null>;

    retrieveByIds(ids: UUID[]): Promise<Address[]>;
}

export interface IAddressRepository extends IAddressCommandRepository, IAddressQueryRepository {}
