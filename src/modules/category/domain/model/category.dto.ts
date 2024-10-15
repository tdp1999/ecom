import { ERR_COMMON_EMPTY_PAYLOAD } from '@shared/errors/common-errors';
import { SearchSchema } from '@shared/dtos/seach.dto';
import { STATUS } from '@shared/enums/status.enum';
import { z } from 'zod';
import { ERR_CATEGORY_INVALID_POSITION, ERR_CATEGORY_NAME_TOO_SHORT } from '../errors/category.error';

export const CategoryCreateSchema = z.object({
    name: z.string().min(3, ERR_CATEGORY_NAME_TOO_SHORT.message),
    image: z.string().optional(),
    description: z.string().optional(),
    position: z.number().min(0, ERR_CATEGORY_INVALID_POSITION.message).default(0),
    parentId: z.string().uuid().nullable().optional(),
    status: z.nativeEnum(STATUS).optional().default(STATUS.ACTIVE),
});

export const CategoryUpdateSchema = z
    .object({
        isDeleted: z.boolean().optional().default(false),
    })
    .merge(CategoryCreateSchema.partial())
    .refine((data) => Object.keys(data).length > 0, {
        message: ERR_COMMON_EMPTY_PAYLOAD.message,
    });

export const CategorySearchSchema = SearchSchema.merge(CategoryCreateSchema.pick({ name: true }));

export type CategoryCreateDto = z.infer<typeof CategoryCreateSchema>;
export type CategoryUpdateDto = z.infer<typeof CategoryUpdateSchema>;
export type CategorySearchDto = z.infer<typeof CategorySearchSchema>;
