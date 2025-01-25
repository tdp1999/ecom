import { ERR_CART_DELTA_ZERO } from '@cart/domain/cart.error';
import { z } from 'zod';
import { CartItemIdentifierSchema } from './cart.model';

export const CartUpdateQuantitySchema = z.object({
    ...CartItemIdentifierSchema.shape,
    delta: z
        .number()
        .int()
        .refine((delta) => delta !== 0, ERR_CART_DELTA_ZERO.message),
});

export type CartUpdateQuantityDto = z.infer<typeof CartUpdateQuantitySchema>;
