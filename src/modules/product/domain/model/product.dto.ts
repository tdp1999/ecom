import { UuidSchema } from '@shared/models/general-value-object.model';
import { z } from 'zod';
import { PRODUCT_GENDER } from './product.type';
import {
    ERR_PRODUCT_BRAND_ID_MUST_BE_VALID_UUID,
    ERR_PRODUCT_CATEGORY_ID_MUST_BE_VALID_UUID,
    ERR_PRODUCT_NAME_TOO_SHORT,
    ERR_PRODUCT_PRICE_MUST_BE_POSITIVE,
    ERR_PRODUCT_QUANTITY_MUST_BE_NON_NEGATIVE,
    ERR_PRODUCT_RATING_BETWEEN_0_TO_5,
    ERR_PRODUCT_SALE_COUNT_MUST_BE_NON_NEGATIVE,
    ERR_PRODUCT_SALE_PRICE_MUST_BE_NON_NEGATIVE,
} from './product.error';
import { STATUS } from '@shared/enums/status.enum';
import { ERR_COMMON_EMPTY_PAYLOAD } from '@shared/errors/common-errors';
import { SearchSchema } from '@shared/dtos/seach.dto';

export const ProductCreateSchema = z.object({
    name: z.string().min(2, ERR_PRODUCT_NAME_TOO_SHORT.message),
    gender: z.nativeEnum(PRODUCT_GENDER).default(PRODUCT_GENDER.UNISEX),
    price: z.number().positive(ERR_PRODUCT_PRICE_MUST_BE_POSITIVE.message),
    salePrice: z.number().nonnegative(ERR_PRODUCT_SALE_PRICE_MUST_BE_NON_NEGATIVE.message).default(0),
    colors: z.array(z.string()).optional(),
    quantity: z.number().int().nonnegative(ERR_PRODUCT_QUANTITY_MUST_BE_NON_NEGATIVE.message),
    brandId: z.string().uuid(ERR_PRODUCT_BRAND_ID_MUST_BE_VALID_UUID).optional(),
    categoryIds: z.array(z.string().uuid(ERR_PRODUCT_CATEGORY_ID_MUST_BE_VALID_UUID)).optional(),
    content: z.string().optional(),
    description: z.string().optional(),
    rating: z
        .number()
        .int()
        .min(0, ERR_PRODUCT_RATING_BETWEEN_0_TO_5.message)
        .max(5, ERR_PRODUCT_RATING_BETWEEN_0_TO_5.message)
        .optional(),
    saleCount: z.number().int().nonnegative(ERR_PRODUCT_SALE_COUNT_MUST_BE_NON_NEGATIVE.message).default(0),
    status: z.nativeEnum(STATUS).optional().default(STATUS.ACTIVE),
});

export const ProductUpdateSchema = z
    .object({
        deletedAt: z.bigint().nullable().optional(),
        deletedById: UuidSchema.nullable().optional(),
    })
    .merge(ProductCreateSchema.partial())
    .refine((data) => Object.keys(data).length > 0, {
        message: ERR_COMMON_EMPTY_PAYLOAD.message,
    });

export const ProductSearchSchema = SearchSchema.merge(ProductCreateSchema.pick({ name: true, status: true })).partial();
export const ProductFilterSchema = z.object({
    fromPrice: z.number().positive(ERR_PRODUCT_PRICE_MUST_BE_POSITIVE).optional(),
    toPrice: z.number().positive(ERR_PRODUCT_PRICE_MUST_BE_POSITIVE).optional(),
    brandId: z.string().uuid(ERR_PRODUCT_BRAND_ID_MUST_BE_VALID_UUID).optional(),
    categoryId: z.string().uuid(ERR_PRODUCT_CATEGORY_ID_MUST_BE_VALID_UUID).optional(),
});

export type ProductCreateDto = z.infer<typeof ProductCreateSchema>;
export type ProductUpdateDto = z.infer<typeof ProductUpdateSchema>;
export type ProductSearchDto = z.infer<typeof ProductSearchSchema>;
export type ProductFilterDto = z.infer<typeof ProductFilterSchema>;
