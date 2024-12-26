import { SearchSchema } from '@shared/dtos/seach.dto';
import { ERR_COMMON_EMPTY_PAYLOAD } from '@shared/errors/common-errors';
import { UuidSchema } from '@shared/models/general-value-object.model';
import { z } from 'zod';

export const PermissionCreateSchema = z.object({
    name: z.string(),
    description: z.string().nullable().optional(),
    resource: z.string(),
    action: z.string(),
});

export const PermissionUpdateSchema = z
    .object({
        deletedAt: z.bigint().nullable().optional(),
        deletedById: UuidSchema.nullable().optional(),
        ...PermissionCreateSchema.partial().shape,
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: ERR_COMMON_EMPTY_PAYLOAD.message,
    });

export const PermissionSearchSchema = z
    .object({
        ...SearchSchema.shape,
        ...PermissionCreateSchema.shape,
        slug: z.string(),
    })
    .partial();

export type PermissionCreateDto = z.infer<typeof PermissionCreateSchema>;
export type PermissionUpdateDto = z.infer<typeof PermissionUpdateSchema>;
export type PermissionSearchDto = z.infer<typeof PermissionSearchSchema>;
