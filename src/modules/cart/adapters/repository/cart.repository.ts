import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from '@shared/types/general.type';
import { EntityManager, Repository } from 'typeorm';
import {
    CartClearDto,
    CartGetItemDto,
    CartListDto,
    CartRemoveItemDto,
    CartUpdateQuantityDto,
} from '../../domain/cart.dto';
import { CartItem } from '../../domain/cart.model';
import { ICartRepository } from '../../domain/ports/cart-repository.interface';
import { CartEntity } from './cart.entity';

@Injectable()
export class CartRepository implements ICartRepository {
    private readonly repository: Repository<CartEntity>;

    constructor(private readonly entityManager: EntityManager) {
        this.repository = this.entityManager.getRepository(CartEntity);
    }

    list(payload: CartListDto): Promise<CartItem[]> {
        throw new Error('Method not implemented.');
    }

    updateQuantity(payload: CartUpdateQuantityDto): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    removeItem(payload: CartRemoveItemDto): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    clear(payload: CartClearDto): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    async findAndLockById(payload: CartGetItemDto): Promise<CartItem | null> {
        return await this.repository
            .createQueryBuilder()
            .setLock('pessimistic_write')
            .where({ ...payload })
            .getOne();
    }

    save(cartItem: CartItem): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
