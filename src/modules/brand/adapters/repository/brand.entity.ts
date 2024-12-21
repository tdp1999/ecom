import { STATUS } from '@shared/enums/status.enum';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Brand } from '../../domain/model/brand.model';

@Entity('brands')
export class BrandEntity extends BaseEntity implements Brand {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    description: string;

    @Column({ name: 'tag_line', nullable: true })
    tagLine: string;

    @Column({ type: 'enum', enum: STATUS, default: STATUS.ACTIVE })
    status: STATUS;

    @Column({ type: 'bigint', name: 'created_at' })
    createdAt: bigint;

    @Column({ type: 'bigint', name: 'updated_at' })
    updatedAt: bigint;

    @Column({ type: 'bigint', name: 'deleted_at', nullable: true })
    deletedAt: bigint | null;
}
