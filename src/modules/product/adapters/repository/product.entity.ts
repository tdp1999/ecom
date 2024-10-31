import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../domain/model/product.model';
import { PRODUCT_GENDER } from '../../domain/model/product.type';
import { STATUS } from '@shared/enums/status.enum';

@Entity('products')
export class ProductEntity extends BaseEntity implements Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', length: 36, nullable: true })
    brandId?: string;

    @Column({ type: 'simple-array', nullable: true })
    categoryIds: string[];

    @Column()
    name: string;

    @Column({ type: 'enum', enum: PRODUCT_GENDER })
    gender: PRODUCT_GENDER;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ name: 'sale_price', type: 'decimal', precision: 10, scale: 2, default: 0 })
    salePrice: number;

    @Column({ type: 'simple-array', nullable: true })
    colors?: string[];

    @Column({ type: 'int', default: 0 })
    quantity: number;

    @Column({ type: 'mediumtext', nullable: true })
    content?: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'float', nullable: true, default: 0 })
    rating?: number;

    @Column({ type: 'int', default: 0 })
    saleCount: number;

    @Column({ type: 'enum', enum: STATUS, default: STATUS.ACTIVE })
    status: STATUS;

    @Column({ type: 'bigint' })
    createdAt: bigint;

    @Column({ type: 'bigint' })
    updatedAt: bigint;

    @Column({ type: 'bigint', nullable: true })
    deletedAt?: bigint | null;
}
