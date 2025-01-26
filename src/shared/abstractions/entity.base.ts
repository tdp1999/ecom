import { BaseEntity as TypeOrmBaseEntity, BeforeUpdate, Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseEntity extends TypeOrmBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'bigint', name: 'created_at' })
    createdAt: bigint;

    @Column({ type: 'uuid', name: 'created_by_id' })
    createdById: string;

    @Column({ type: 'bigint', name: 'updated_at' })
    updatedAt: bigint;

    @Column({ type: 'uuid', name: 'updated_by_id' })
    updatedById: string;

    @Column({ type: 'bigint', name: 'deleted_at', nullable: true })
    deletedAt?: bigint | null;

    @Column({ type: 'uuid', name: 'deleted_by_id', nullable: true })
    deletedById?: string | null;

    @BeforeUpdate()
    updateDates() {
        this.updatedAt = BigInt(Date.now());
    }
}

export interface BaseEntityInterface {
    id: string;
    createdAt: bigint;
    createdById: string;
    updatedAt: bigint;
    updatedById: string;
    deletedAt?: bigint | null;
    deletedById?: string | null;
}
