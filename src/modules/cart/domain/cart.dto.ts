import { z } from 'zod';
import { CartItemIdentifierSchema } from './cart.model';

export const CartUpdateQuantitySchema = z.object({
    ...CartItemIdentifierSchema.shape,
    delta: z.number().int(),
});

export const CartListSchema = CartItemIdentifierSchema;
export const CartClearSchema = CartItemIdentifierSchema;
export const CartRemoveItemSchema = CartItemIdentifierSchema;
export const CartGetItemSchema = CartItemIdentifierSchema;

export type CartListDto = z.infer<typeof CartListSchema>;
export type CartClearDto = z.infer<typeof CartClearSchema>;
export type CartGetItemDto = z.infer<typeof CartGetItemSchema>;
export type CartRemoveItemDto = z.infer<typeof CartRemoveItemSchema>;
export type CartUpdateQuantityDto = z.infer<typeof CartUpdateQuantitySchema>;
