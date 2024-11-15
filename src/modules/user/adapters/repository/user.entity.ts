import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { USER_ROLE, USER_STATUS } from '../../domain/model/user.type';
import { User } from '../../domain/model/user.model';
import { UserProfileEntity } from './user-profile.entity';

@Entity('users')
export class UserEntity extends BaseEntity implements User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @Column({ type: 'enum', enum: USER_ROLE })
    role: USER_ROLE;

    @Column({ type: 'enum', enum: USER_STATUS, default: USER_STATUS.ACTIVE })
    status: USER_STATUS;

    @OneToOne(() => UserProfileEntity, (profile) => profile.user, {
        cascade: true, // Will automatically save the profile
        eager: false,
    })
    profile: Relation<UserProfileEntity>;

    @Column({ type: 'bigint' })
    createdAt: bigint;

    @Column({ type: 'bigint' })
    updatedAt: bigint;

    @Column({ type: 'bigint', nullable: true })
    deletedAt?: bigint | null;
}
