// eslint-disable-next-line import/no-cycle
import { UserEntity } from '@user/adapters/repository/user.entity';
import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { UserProfile } from '../../domain/model/user.model';
import { USER_GENDER } from '../../domain/model/user.type';

@Entity('user_profiles')
export class UserProfileEntity extends BaseEntity implements UserProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ type: 'varchar', nullable: true })
    avatar: string | null;

    @Column({ type: 'varchar', nullable: true })
    phone: string | null;

    @Column({ type: 'varchar', nullable: true })
    address: string | null;

    @Column({ type: 'bigint', nullable: true })
    birthday: bigint | null;

    @Column({ type: 'enum', enum: USER_GENDER, nullable: true })
    gender: USER_GENDER | null;

    @OneToOne(() => UserEntity, (user) => user.profile, {
        onDelete: 'CASCADE',
    })
    user: Relation<UserEntity>;
}
