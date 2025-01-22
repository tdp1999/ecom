import { CartRepository } from '@cart/adapters/repository/cart.repository';
import { CART_PRODUCT_REPOSITORY_TOKEN } from '@cart/domain/cart.token';
import { ICartProductRepository } from '@cart/domain/ports/cart-product-repository.interface';
import { ICartRepository } from '@cart/domain/ports/cart-repository.interface';
import { ICartUpdateQuantityUow } from '@cart/domain/ports/cart-update-quantity.uow.interface';
import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class CartUpdateQuantityUow implements ICartUpdateQuantityUow {
    constructor(
        @InjectEntityManager() private readonly entityManager: EntityManager,
        @Inject(CART_PRODUCT_REPOSITORY_TOKEN) private readonly cartProductRepository: ICartProductRepository,
    ) {}

    withTransaction<T>(work: (uow: ICartUpdateQuantityUow) => Promise<T>): Promise<T> {
        return this.entityManager.transaction(async (transactionalEntityManager) => {
            const transactionalUow = new CartUpdateQuantityUow(transactionalEntityManager, this.cartProductRepository);
            return work(transactionalUow);
        });
    }

    getProductRepository(): ICartProductRepository {
        return this.cartProductRepository;
    }

    getCartRepository(): ICartRepository {
        return new CartRepository(this.entityManager);
    }
}
