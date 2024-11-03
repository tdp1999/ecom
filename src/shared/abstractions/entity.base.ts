import { BaseEntity as TypeOrmBaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseEntity extends TypeOrmBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'bigint' })
    createdAt: bigint;

    @Column({ type: 'bigint' })
    updatedAt: bigint;

    @Column({ type: 'bigint', nullable: true })
    deletedAt?: bigint | null;
}

export interface BaseEntityInterface {
    id: string;
    createdAt: bigint;
    updatedAt: bigint;
    deletedAt?: bigint | null;
}
