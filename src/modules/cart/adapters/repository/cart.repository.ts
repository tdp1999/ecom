import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from '@shared/types/general.type';
import { Repository } from 'typeorm';
import { CartUpdateQuantityDto } from '../../domain/cart.dto';
import { CartItem, CartItemIdentifier } from '../../domain/cart.model';
import { ICartRepository } from '../../domain/ports/cart-repository.interface';
import { CartEntity } from './cart.entity';

@Injectable()
export class CartRepository implements ICartRepository {
    constructor(@InjectRepository(CartEntity) protected repository: Repository<CartEntity>) {}

    async listItem(userId: UUID): Promise<CartItem[]> {
        return await this.repository.find({ where: { userId } });
    }

    async getItemByIdentifier(
        identifier: CartItemIdentifier,
        visibleColumns?: (keyof CartItem)[],
    ): Promise<CartItem | null> {
        return await this.repository.findOne({
            where: identifier,
            ...(visibleColumns && visibleColumns.length && { select: visibleColumns }),
        } as any);
    }

    async exist(id: UUID): Promise<boolean> {
        return await this.repository.exists({ where: { id } });
    }

    async addItemToCart(item: CartItem): Promise<CartItem> {
        return await this.repository.save(item);
    }

    async removeItemFromCart(id: UUID): Promise<boolean> {
        await this.repository.delete({ id });

        return true;
    }

    async updateItemQuantity(id: UUID, quantity: number): Promise<CartItem> {
        const entity = await this.repository.findOneBy({ id });
        if (!entity) throw new Error('Cart item not found.');
        entity.quantity = quantity;
        return await this.repository.save(entity);
    }

    async clearCart(userId: UUID): Promise<boolean> {
        await this.repository.delete({ userId });
        return true;
    }

    async updateQuantity(payload: CartUpdateQuantityDto): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    async removeItem(payload: CartItemIdentifier): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    async clear(payload: CartItemIdentifier): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
}
