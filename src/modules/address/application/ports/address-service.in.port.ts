import { UUID } from '@shared/types/general.type';
import { Pagination } from '@shared/types/pagination.type';
import { SharedUser } from '@shared/types/user.shared.type';
import { AddressCreateCommandDto, AddressQueryDto, AddressUpdateCommandDto, AddressViewDto } from '../dtos/address.dto';

export interface IAddressService {
    list(query?: AddressQueryDto): Promise<AddressViewDto[]>;

    paginatedList(query?: AddressQueryDto): Promise<Pagination<AddressViewDto>>;

    get(id: UUID): Promise<AddressViewDto | null>;

    exist(id: UUID): Promise<boolean>;

    // IAddress can be replaced with AddressCreateCommandDto, and UUID can be replaced with AddressCreateOutcomeDto
    create(user: SharedUser, payload: AddressCreateCommandDto): Promise<UUID>;

    // IAddress can be replaced with AddressUpdateCommandDto, and boolean can be replaced with AddressUpdateOutcomeDto
    update(user: SharedUser, id: UUID, payload: AddressUpdateCommandDto): Promise<boolean>;

    delete(user: SharedUser, id: UUID, isHardDelete?: boolean): Promise<boolean>;
}
