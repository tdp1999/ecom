import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { withDefaultOrder } from '@shared/builders/order.builder';
import { WhereBuilder } from '@shared/builders/where.builder';
import { DEFAULT_LIMIT } from '@shared/constants/default.constant';
import { UUID } from '@shared/types/general.type';
import { Pagination } from '@shared/types/pagination.type';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { AddressQueryDto, AddressViewDto } from '../application/dtos/address.dto';
import { IAddressRepository } from '../application/ports/address-repository.out.port';
import { Address, IAddress } from '../domain/address.model';
import { AddressEntity } from './address.persistence';

@Injectable()
export class AddressRepository implements IAddressRepository {
    constructor(@InjectRepository(AddressEntity) private repository: Repository<AddressEntity>) {}

    private _toDomain(entity: AddressEntity): Address {
        return Address.fromPersistence(entity);
    }

    private _toPersistence(address: Address): AddressEntity {
        return this.repository.create(address);
    }

    private _buildWhereClause(
        qb: SelectQueryBuilder<AddressEntity>,
        query: AddressQueryDto,
    ): SelectQueryBuilder<AddressEntity> {
        return WhereBuilder.create(qb, 'address')
            .like('city', query.city)
            .like('stateOrProvince', query.stateOrProvince)
            .like('country', query.country)
            .orLike(['country', 'stateOrProvince', 'city', 'address1'], query.key)
            .build();
    }

    async add(address: Address): Promise<boolean> {
        const entity = this._toPersistence(address);
        await this.repository.insert(entity);
        return true;
    }

    async update(id: UUID, address: Address): Promise<boolean> {
        await this.repository.update(id, address);
        return true;
    }

    async remove(id: UUID): Promise<boolean> {
        await this.repository.delete(id);
        return true;
    }

    findById(id: UUID, columns?: (keyof IAddress)[]): Promise<AddressViewDto | null> {
        return this.repository.findOne({ where: { id }, select: columns });
    }

    getById(id: UUID, columns?: (keyof IAddress)[]): Promise<AddressViewDto> {
        return this.repository.findOneOrFail({ where: { id }, select: columns });
    }

    exists(id: UUID): Promise<boolean> {
        return this.repository.existsBy({ id });
    }

    async existAndNotDeleted(id: UUID): Promise<boolean> {
        const entity = await this.repository
            .createQueryBuilder('entity')
            .where('entity.id = :id', { id })
            .andWhere('entity.deletedAt IS NULL')
            .select('1')
            .getRawOne();

        return entity !== null;
    }

    async list(query?: AddressQueryDto, columns?: (keyof IAddress)[]): Promise<AddressViewDto[]> {
        const alias = 'address';
        let qb = this.repository.createQueryBuilder(alias);

        if (query) {
            qb = this._buildWhereClause(qb, query);
            qb = withDefaultOrder(qb, alias, query);
        }

        const rawResult = await qb.select(columns ?? []).getRawMany();
        return this.repository.create(rawResult);
    }

    async paginatedList(query?: AddressQueryDto, columns?: (keyof IAddress)[]): Promise<Pagination<AddressViewDto>> {
        const page = query?.page || 1;
        const limit = query?.limit || DEFAULT_LIMIT;
        const offset = (page - 1) * limit;

        const alias = 'address';
        let qb = this.repository.createQueryBuilder(alias);

        if (query) {
            qb = this._buildWhereClause(qb, query);
            qb = withDefaultOrder(qb, alias, query);
        }

        qb.skip(offset).take(limit);

        const total = await qb.getCount();
        const items = await qb.select(columns ?? []).getRawMany();
        return { items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }

    async retrieveById(id: UUID): Promise<Address | null> {
        const entity = await this.repository.findOneBy({ id });
        return entity ? this._toDomain(entity) : null;
    }

    async retrieveByIds(ids: UUID[]): Promise<Address[]> {
        const entities = await this.repository.findBy({ id: In(ids) });
        return entities.map((entity) => this._toDomain(entity));
    }
}
