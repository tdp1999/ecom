import { ICartProductRepository } from './cart-product-repository.interface';
import { ICartRepository } from './cart-repository.interface';

export interface ICartUpdateQuantityUow {
    withTransaction<T>(work: (uow: ICartUpdateQuantityUow) => Promise<T>): Promise<T>;

    getProductRepository(): ICartProductRepository;

    getCartRepository(): ICartRepository;
}
