import {
    ERR_CART_PRODUCT_NOT_ENOUGH_QUANTITY,
    ERR_CART_PRODUCT_NOT_FOUND,
    ERR_CART_REDUCE_NONE_EXISTING_PRODUCT,
    ERR_CART_REDUCED_QUANTITY_EXCEEDS_QUANTITY,
} from '@cart/domain/cart.error';
import { Inject, Injectable } from '@nestjs/common';
import { ERR_COMMON_DATA_NOT_FOUND } from '@shared/errors/common-errors';
import { BadRequestError, InternalServerError } from '@shared/errors/domain-error';
import { formatZodError } from '@shared/errors/error-formatter';
import { UUID } from '@shared/types/general.type';
import { v7 } from 'uuid';
import { CartUpdateQuantityDto, CartUpdateQuantitySchema } from './cart.dto';
import { CartItem, CartProductSchema } from './cart.model';
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

    async list(userId: UUID): Promise<CartItem[]> {
        const cartItems = await this.repository.listItem(userId);

        await this.loadCartItemRelations(cartItems);

        return cartItems;
    }

    async updateQuantity(payload: CartUpdateQuantityDto): Promise<boolean> {
        const { success, error, data } = CartUpdateQuantitySchema.safeParse(payload);
        if (!success) throw BadRequestError(formatZodError(error));

        if (!data) throw InternalServerError(ERR_COMMON_DATA_NOT_FOUND.message);

        const product = await this.productRepository.load(data.productId);
        if (!product) throw BadRequestError(ERR_CART_PRODUCT_NOT_FOUND.message);

        const identifier = { productId: data.productId, userId: data.userId, attribute: data.attribute };
        const cartItem = await this.repository.getItemByIdentifier(identifier);

        /*
         * Flow here:
         * 1. Get product quantity
         * 2. Check if update quantity in the payload is negative (reduce quantity) or positive (increase quantity)
         * 3. If negative, check if reduced quantity exceeds current quantity. If so, throw error
         * 4. If positive, check if increased quantity exceeds inventory quantity. If so, throw error
         * 5. Update quantity property of the cart
         * */

        // If cart item not exists -> add new cart item
        if (!cartItem) {
            if (data.delta < 0) throw BadRequestError(ERR_CART_REDUCE_NONE_EXISTING_PRODUCT.message);

            if (data.delta > product.quantity) throw BadRequestError(ERR_CART_PRODUCT_NOT_ENOUGH_QUANTITY.message);

            const currentTimestamp = BigInt(Date.now());

            const item = {
                id: v7(),
                ...identifier,
                createdAt: currentTimestamp,
                createdById: data.userId,
                updatedAt: currentTimestamp,
                updatedById: data.userId,
                quantity: 1,
            };

            await this.repository.addItemToCart(item);

            return true;
        }

        // If cart is existed
        // Reduce quantity
        if (data.delta < 0 && cartItem.quantity + data.delta < 0) {
            throw BadRequestError(ERR_CART_REDUCED_QUANTITY_EXCEEDS_QUANTITY.message);
        }

        // Remove item
        if (cartItem.quantity + data.delta === 0) {
            return this.removeItem(cartItem.id, data.userId);
        }

        // Increase quantity
        if (data.delta > 0 && cartItem.quantity + data.delta > product.quantity) {
            throw BadRequestError(ERR_CART_PRODUCT_NOT_ENOUGH_QUANTITY.message);
        }

        await this.repository.updateItemQuantity(cartItem.id, cartItem.quantity + data.delta);

        return true;
    }

    async removeItem(id: UUID, userId: UUID): Promise<boolean> {
        const cartItem = await this.repository.getItemById(id);
        if (!cartItem) throw BadRequestError(ERR_CART_REDUCE_NONE_EXISTING_PRODUCT.message);
        if (cartItem.userId !== userId) throw BadRequestError(ERR_CART_REDUCE_NONE_EXISTING_PRODUCT.message);
        return this.repository.removeItemFromCart(id);
    }

    async clear(userId: UUID): Promise<boolean> {
        return this.repository.clearCart(userId);
    }

    private async loadCartItemRelations(cartItems: CartItem[]) {
        const productIds = cartItems.map((cartItem) => cartItem.productId);

        if (!productIds.length) return;

        const products = await this.productRepository.loadByIds(productIds);
        const productMap = new Map(
            products.map((product) => {
                if (!product || !product.id) return [null, null];

                const parsedProduct = CartProductSchema.safeParse(product);
                if (!parsedProduct.success) return [product.id, null];

                return [product.id, parsedProduct.data];
            }),
        );

        cartItems.forEach((cartItem) => {
            cartItem.product = productMap.get(cartItem.productId) ?? undefined;
        });
    }
}
