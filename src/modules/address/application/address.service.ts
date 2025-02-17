import { Inject, Injectable } from '@nestjs/common';
import { BadRequestError } from '@shared/errors/domain-error';
import { formatZodError } from '@shared/errors/error-formatter';
import { UUID } from '@shared/types/general.type';
import { Pagination } from '@shared/types/pagination.type';
import { SharedUser } from '@shared/types/user.shared.type';
import { TemporalValue } from '@shared/vos/temporal.value';
import { Address, IAddress } from '../domain/address.model';
import { ADDRESS_REPOSITORY_TOKEN } from './address.token';
import {
    AddressCreateCommandDto,
    AddressQueryDto,
    AddressQuerySchema,
    AddressUpdateCommandDto,
    AddressViewDto,
} from './dtos/address.dto';
import { IAddressRepository } from './ports/address-repository.out.port';
import { IAddressService } from './ports/address-service.in.port';

@Injectable()
export class AddressService implements IAddressService {
    constructor(@Inject(ADDRESS_REPOSITORY_TOKEN) private readonly repository: IAddressRepository) {}

    protected listColumns: (keyof IAddress)[] | undefined = [
        'id',
        'country',
        'stateOrProvince',
        'city',
        'address1',
        'address2',
        'addressType',
    ];

    list(query?: AddressQueryDto): Promise<AddressViewDto[]> {
        const { success, error, data } = AddressQuerySchema.safeParse(query);

        if (!success) throw BadRequestError(formatZodError(error));

        return this.repository.list(data, this.listColumns);
    }

    paginatedList(query?: AddressQueryDto): Promise<Pagination<AddressViewDto>> {
        const { success, error, data } = AddressQuerySchema.safeParse(query);

        if (!success) throw BadRequestError(formatZodError(error));

        return this.repository.paginatedList(data, this.listColumns);
    }

    get(id: UUID): Promise<AddressViewDto | null> {
        return this.repository.findById(id);
    }

    exist(id: UUID): Promise<boolean> {
        return this.repository.exists(id);
    }

    async create(user: SharedUser, payload: AddressCreateCommandDto): Promise<UUID> {
        const model = Address.fromJSON(payload, user);

        await this.repository.add(model);

        return model.id;
    }

    async update(user: SharedUser, id: UUID, payload: AddressUpdateCommandDto): Promise<boolean> {
        let model = await this.repository.retrieveById(id);

        if (!model) throw BadRequestError(`Address with id ${id} not found`);

        model = model.update(payload, user);

        return this.repository.update(model.id, model);
    }

    delete(user: SharedUser, id: UUID, isHardDelete?: boolean): Promise<boolean> {
        const exist = this.repository.existAndNotDeleted(id);

        if (!exist) throw BadRequestError(`Address with id ${id} not found`);

        if (isHardDelete) return this.repository.remove(id);

        return this.update(user, id, { deletedAt: TemporalValue.getNow(), deletedById: user.id });
    }
}
