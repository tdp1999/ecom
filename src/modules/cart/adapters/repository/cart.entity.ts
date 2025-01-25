import { BaseEntity } from '@shared/abstractions/entity.base';
import { Column, Entity, Index } from 'typeorm';
import { CartItem } from '../../domain/cart.model';

@Entity('carts')
@Index('IDX_carts_userId_productId_attribute', ['userId', 'productId', 'attribute'], { unique: true })
export class CartEntity extends BaseEntity implements CartItem {
    @Column({ type: 'uuid', length: 36, nullable: true })
    userId: string;

    @Column({ type: 'uuid', length: 36, nullable: true })
    productId: string;

    @Column({ type: 'varchar', nullable: true, default: '' })
    attribute: string | null;

    @Column({ type: 'int', nullable: false, default: 1 })
    quantity: number;
}
