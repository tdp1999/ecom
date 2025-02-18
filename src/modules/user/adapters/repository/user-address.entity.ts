/* eslint-disable import/no-cycle */
import { ADDRESS_TYPE } from '@address/domain/address.type';
import { BaseEntity } from '@shared/abstractions/entity.base';
import { UserEntity } from '@user/adapters/repository/user.entity';
import { UserAddress } from '@user/domain/model/user.model';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('user_addresses')
export class UserAddressEntity extends BaseEntity implements UserAddress {
    @Column()
    name: string;

    @Column()
    phone: string;

    @Column({ type: 'uuid', length: 36 })
    addressId: string;

    @Column({ type: 'uuid', length: 36 })
    userId: string;

    @OneToMany(() => UserEntity, (user) => user.addresses, {
        cascade: true,
        eager: false,
        onDelete: 'CASCADE',
    })
    user: UserEntity;

    @Column({ type: 'boolean', default: false })
    isDefault: boolean;

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
