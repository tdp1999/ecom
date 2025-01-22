import { Inject, Injectable } from '@nestjs/common';
import { BadRequestError } from '@shared/errors/domain-error';
import { formatZodError } from '@shared/errors/error-formatter';
import { CartClearDto, CartListDto, CartListSchema, CartRemoveItemDto } from './cart.dto';
import { CartItem } from './cart.model';
import { CART_PRODUCT_REPOSITORY_TOKEN, CART_REPOSITORY_TOKEN } from './cart.token';
import { ICartProductRepository } from './ports/cart-product-repository.interface';
import { ICartRepository } from './ports/cart-repository.interface';
import { ICartService } from './ports/cart-service.interface';

@Injectable()
export class CartService implements ICartService {
    constructor(
        @Inject(CART_REPOSITORY_TOKEN) private readonly repository: ICartRepository,
        @Inject(CART_PRODUCT_REPOSITORY_TOKEN) private readonly productRepository: ICartProductRepository,
    ) {}

    async list(payload: CartListDto): Promise<CartItem[]> {
        const { success, error, data } = CartListSchema.safeParse(payload);

        if (!success) throw BadRequestError(formatZodError(error));

        const cartItems = await this.repository.list(data);

        await this.loadCartItemRelations(cartItems);

        return cartItems;
    }

    // async updateQuantity(payload: CartUpdateQuantityDto): Promise<boolean> {
    //     const { success, error, data } = CartUpdateQuantitySchema.safeParse(payload);
    //
    //     if (!success) throw BadRequestError(formatZodError(error));
    //
    //     const product = await this.productRepository.load(data.productId);
    //
    //     if (!product) throw BadRequestError(ERR_CART_PRODUCT_NOT_FOUND.message);
    //
    //     /*
    //      * Flow here:
    //      * 1. Get product quantity
    //      * 2. Check if update quantity in the payload is negative (reduce quantity) or positive (increase quantity)
    //      * 3. If negative, check if reduced quantity exceeds current quantity. If so, throw error
    //      * 4. If positive, check if increased quantity exceeds inventory quantity. If so, throw error
    //      * 5. Update quantity property of the cart
    //      * 6. Update quantity property of the product
    //      * */
    //
    //     return true;
    // }

    removeItem(payload: CartRemoveItemDto): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    clear(payload: CartClearDto): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    private async loadCartItemRelations(cartItems: CartItem[]) {
        throw new Error('Method not implemented.');
    }
}
