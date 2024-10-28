import { STATUS } from '@shared/enums/status.enum';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from 'typeorm';
import { Category } from '../../domain/model/category.model';

@Entity('categories')
@Tree('closure-table')
export class CategoryEntity extends BaseEntity implements Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    isGroup: boolean;

    @Column()
    isClickable: boolean;

    @TreeChildren()
    children?: CategoryEntity[];

    // TODO: change to uuid
    @Column({ type: 'varchar', length: 36, nullable: true })
    parentId?: string | null;

    @TreeParent()
    parent: CategoryEntity | null;

    @Column({ type: 'json', nullable: true })
    metadata: Record<string, any>;

    @Column({ type: 'enum', enum: STATUS, default: STATUS.ACTIVE })
    status: STATUS;

    @Column({ type: 'bigint', name: 'created_at' })
    createdAt: bigint;

    @Column({ type: 'bigint', name: 'updated_at' })
    updatedAt: bigint;

    @Column({ type: 'bigint', name: 'deleted_at', nullable: true })
    deletedAt: bigint | null;
}
