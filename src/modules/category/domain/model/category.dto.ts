import { SearchSchema } from '@shared/dtos/seach.dto';
import { STATUS } from '@shared/enums/status.enum';
import { ERR_COMMON_EMPTY_PAYLOAD } from '@shared/errors/common-errors';
import { z } from 'zod';
import {
    ERR_CATEGORY_INVALID_POSITION,
    ERR_CATEGORY_NAME_TOO_SHORT,
    ERR_CATEGORY_SLUG_TOO_SHORT,
} from './category.error';
import { CategoryId } from './category.model';

export const CategoryCreateMetadataSchema = z.object({
    description: z.string().optional(),
    displayOrder: z.number().min(0, ERR_CATEGORY_INVALID_POSITION.message).default(0).optional(),
    icon: z.string().url().optional(),
    image: z.string().optional(),
    slug: z.string().min(3, ERR_CATEGORY_SLUG_TOO_SHORT.message).optional(),
});

export const CategoryCreateSchema = z.object({
    name: z.string().min(3, ERR_CATEGORY_NAME_TOO_SHORT.message),
    ancestorId: CategoryId.optional(),
    isGroup: z.boolean().optional().default(false),
    isClickable: z.boolean().optional().default(true),
    status: z.nativeEnum(STATUS).optional().default(STATUS.ACTIVE),
    metadata: CategoryCreateMetadataSchema,
});

export const CategoryUpdateSchema = z
    .object({
        deletedAt: z.bigint().nullable().optional(),
    })
    .merge(CategoryCreateSchema.partial())
    .refine((data) => Object.keys(data).length > 0, {
        message: ERR_COMMON_EMPTY_PAYLOAD.message,
    });

export const CategoryMoveSchema = z.object({
    categoryId: CategoryId,
    newParentId: CategoryId,
});

export const CategorySearchSchema = SearchSchema.merge(CategoryCreateSchema.pick({ name: true, status: true }))
    .partial()
    .optional();

export type CategoryCreateDto = z.infer<typeof CategoryCreateSchema>;
export type CategoryUpdateDto = z.infer<typeof CategoryUpdateSchema>;
// export type CategoryMoveDto = z.infer<typeof CategoryMoveSchema>;
export type CategorySearchDto = z.infer<typeof CategorySearchSchema>;
