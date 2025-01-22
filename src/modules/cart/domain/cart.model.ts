import { AuditableSchema } from '@shared/models/auditable.model';
import { UuidSchema } from '@shared/models/general-value-object.model';
import { z } from 'zod';

export const CartProductSchema = z.object({
    id: UuidSchema,
    name: z.string(),
    price: z.number().positive(),
    salePrice: z.number().nonnegative(),
    quantity: z.number().int().nonnegative(),
});

export const CartItemIdentifierSchema = z.object({
    userId: UuidSchema,
    productId: UuidSchema,
    attribute: z.string().nullable().optional().default(''),
});

export const CartItemSchema = z.object({
    ...CartItemIdentifierSchema.shape,
    ...AuditableSchema.shape,
    id: UuidSchema,
    quantity: z.number().int().nonnegative(),
});

export type CartProduct = z.infer<typeof CartProductSchema>;
export type CartItem = z.infer<typeof CartItemSchema> & { product?: CartProduct };
