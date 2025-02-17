import { BaseEntity } from '@shared/abstractions/entity.base';
import { Column, Entity } from 'typeorm';
import { ADDRESS_TYPE } from '../domain/address.type';
import { IAddress } from '../domain/address.model';

@Entity('addresses')
export class AddressEntity extends BaseEntity implements IAddress {
    @Column()
    country: string;

    @Column()
    stateOrProvince: string;

    @Column()
    city: string;

    @Column({ length: 200 })
    address1: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    address2?: string | null;

    @Column({ type: 'enum', enum: ADDRESS_TYPE })
    addressType: ADDRESS_TYPE;

    @Column({ type: 'text', nullable: true })
    remarks?: string | null;
}
