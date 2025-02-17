/* eslint-disable import/no-cycle */
import { BaseEntity } from '@shared/abstractions/entity.base';
import { USER_STATUS } from '@shared/enums/shared-user.enum';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { User } from '../../domain/model/user.model';
import { UserProfileEntity } from './user-profile.entity';
import { UserAddressEntity } from '@user/adapters/repository/user-address.entity';

@Entity('users')
export class UserEntity extends BaseEntity implements User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    // CONSIDER: move this to application (use-case) layer, in case this logic need to change
    @Column({ select: false })
    password: string;

    @Column({ select: false })
    salt: string;

    @Column({ type: 'boolean', default: false })
    isSystem: boolean;

    @Column({ type: 'enum', enum: USER_STATUS, default: USER_STATUS.ACTIVE })
    status: USER_STATUS;

    @Column({ type: 'uuid', length: 36, nullable: true })
    roleId?: string | null;

    @OneToOne(() => UserProfileEntity, (profile) => profile.user, {
        cascade: true,
        eager: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    profile: Relation<UserProfileEntity>;

    @OneToMany(() => UserAddressEntity, (address) => address.user)
    addresses: UserAddressEntity[];
}
