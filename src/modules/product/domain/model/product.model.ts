import { AuditableSchema } from '@shared/models/auditable.model';
import { z } from 'zod';
import { PRODUCT_GENDER } from './product.type';
import { STATUS } from '@shared/enums/status.enum';
import { UuidSchema } from '@shared/models/general-value-object.model';

export const ProductCategorySchema = z.object({
    id: UuidSchema,
    name: z.string(),
});

export const ProductCategoryListSchema = z.array(ProductCategorySchema);

export const ProductBrandSchema = z.object({
    id: UuidSchema,
    name: z.string(),
});

export const ProductSchema = z.object({
    id: UuidSchema,
    brandId: UuidSchema.optional(),
    categoryIds: z.array(UuidSchema).optional(),

    name: z.string(),
    gender: z.nativeEnum(PRODUCT_GENDER),
    price: z.number().positive(),
    salePrice: z.number().nonnegative(),
    colors: z.array(z.string()).optional(),
    quantity: z.number().int().nonnegative(),

    content: z.string().optional(),
    description: z.string().optional(),
    rating: z.number().min(0).max(5).optional(),
    saleCount: z.number().int().nonnegative(),
    status: z.nativeEnum(STATUS),

    ...AuditableSchema.shape,
});

export type ProductCategory = z.infer<typeof ProductCategorySchema>;
export type ProductBrand = z.infer<typeof ProductBrandSchema>;
export type Product = z.infer<typeof ProductSchema> & {
    brand?: ProductBrand | null;
    categories?: ProductCategory[] | null;
};
