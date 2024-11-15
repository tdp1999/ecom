import { SearchSchema } from '@shared/dtos/seach.dto';
import { STATUS } from '@shared/enums/status.enum';
import { ERR_COMMON_EMPTY_PAYLOAD } from '@shared/errors/common-errors';
import { z } from 'zod';
import { ERR_BRAND_NAME_TOO_SHORT } from './brand.error';

export const BrandCreateSchema = z.object({
    name: z.string().min(3, ERR_BRAND_NAME_TOO_SHORT.message),
    image: z.string().optional(),
    description: z.string().optional(),
    tagLine: z.string().optional(),
    status: z.nativeEnum(STATUS).optional().default(STATUS.ACTIVE),
});

export const BrandUpdateSchema = z
    .object({
        deletedAt: z.bigint().nullable().optional(),
    })
    .merge(BrandCreateSchema.partial())
    .refine((data) => Object.keys(data).length > 0, {
        message: ERR_COMMON_EMPTY_PAYLOAD.message,
    });

export const BrandFindOneSchema = BrandCreateSchema.pick({
    name: true,
    tagLine: true,
})
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: ERR_COMMON_EMPTY_PAYLOAD.message,
    });
export const BrandSearchSchema = SearchSchema.merge(
    BrandCreateSchema.pick({
        name: true,
        tagLine: true,
        status: true,
    }),
).partial();

export type BrandCreateDto = z.infer<typeof BrandCreateSchema>;
export type BrandUpdateDto = z.infer<typeof BrandUpdateSchema>;
export type BrandFindOneDto = z.infer<typeof BrandFindOneSchema>;
export type BrandSearchDto = z.infer<typeof BrandSearchSchema>;
