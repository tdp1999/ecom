import { USER_ROLE, USER_STATUS } from '@shared/enums/shared-user.enum';
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { User } from '../../domain/model/user.model';
// eslint-disable-next-line import/no-cycle
import { UserProfileEntity } from './user-profile.entity';

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

    @Column({ type: 'enum', enum: USER_ROLE })
    role: USER_ROLE;

    @Column({ type: 'enum', enum: USER_STATUS, default: USER_STATUS.ACTIVE })
    status: USER_STATUS;

    @OneToOne(() => UserProfileEntity, (profile) => profile.user, {
        cascade: true,
        eager: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    profile: Relation<UserProfileEntity>;

    @Column({ type: 'bigint' })
    createdAt: bigint;

    @Column({ type: 'bigint' })
    updatedAt: bigint;

    @Column({ type: 'bigint', nullable: true })
    deletedAt?: bigint | null;
}
