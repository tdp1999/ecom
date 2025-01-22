import {
    ERR_CART_PRODUCT_NOT_ENOUGH_QUANTITY,
    ERR_CART_PRODUCT_NOT_FOUND,
    ERR_CART_REDUCED_QUANTITY_EXCEEDS_QUANTITY,
} from '@cart/domain/cart.error';
import { Inject, Injectable } from '@nestjs/common';
import { BadRequestError, NotFoundError } from '@shared/errors/domain-error';
import { formatZodError } from '@shared/errors/error-formatter';
import { IUseCase } from '@shared/interfaces/use-case.interface';
import { CartUpdateQuantityDto, CartUpdateQuantitySchema } from '../cart.dto';
import { CART_UPDATE_QUANTITY_UOW } from '../cart.token';
import { ICartUpdateQuantityUow } from '../ports/cart-update-quantity.uow.interface';

@Injectable()
export class CartUpdateQuantityUseCase implements IUseCase<CartUpdateQuantityDto> {
    constructor(@Inject(CART_UPDATE_QUANTITY_UOW) private readonly uow: ICartUpdateQuantityUow) {}

    async execute(payload: CartUpdateQuantityDto): Promise<boolean> {
        return await this.uow.withTransaction(async (uow) => {
            const { success, error, data } = CartUpdateQuantitySchema.safeParse(payload);

            if (!success) throw BadRequestError(formatZodError(error));

            if (!data) throw BadRequestError('Why?');

            const cartRepo = uow.getCartRepository();
            const productRepo = uow.getProductRepository();

            /*
             * We should lock the cart when:
             * we have a shared cart (like a wishlist that multiple users can modify)
             * we allow multiple sessions for the same user
             * we have background processes that might modify the cart (like auto-removing expired items)
             */
            const cartItem = await cartRepo.findAndLockById({
                userId: data.userId,
                productId: data.productId,
                attribute: data.attribute,
            });
            const product = await productRepo.findAndLockById(data.productId);

            if (!product) throw NotFoundError(ERR_CART_PRODUCT_NOT_FOUND.message);

            console.log('cartItem: ', cartItem);

            const { quantity } = product;
            const { delta } = data;

            if (delta < 0 && !cartItem) throw BadRequestError('Cart item not found');

            if (delta < 0 && (cartItem?.quantity ?? 0) + delta < 0)
                throw BadRequestError(ERR_CART_REDUCED_QUANTITY_EXCEEDS_QUANTITY.message);

            if (delta > 0 && (cartItem?.quantity ?? 0) + delta > quantity)
                throw BadRequestError(ERR_CART_PRODUCT_NOT_ENOUGH_QUANTITY.message);

            console.log('Valid!', cartItem, product);

            // if (quantity < data.quantity) throw BadRequestError(ERR_CART_REDUCED_QUANTITY_EXCEEDS_QUANTITY.message);

            /*
             * Flow here:
             * 1. Get product quantity
             * 2. Check if update quantity in the payload is negative (reduce quantity) or positive (increase quantity)
             * 3. If negative, check if reduced quantity exceeds current quantity. If so, throw error
             * 4. If positive, check if increased quantity exceeds inventory quantity. If so, throw error
             * 5. Update quantity property of the cart
             * 6. Update quantity property of the product
             * */

            // console.log('Here!!', cartRepo);
            return true;
        });
    }
}
