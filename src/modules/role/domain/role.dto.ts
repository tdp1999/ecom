import { ERR_ROLE_MUST_HAVE_AT_LEAST_ONE_PERMISSION } from '@role/domain/role.error';
import { SearchSchema } from '@shared/dtos/seach.dto';
import { ERR_COMMON_EMPTY_PAYLOAD } from '@shared/errors/common-errors';
import { UuidSchema } from '@shared/models/general-value-object.model';
import { z } from 'zod';

export const RoleCreateSchema = z.object({
    name: z.string(),
    description: z.string().nullable().optional(),
    permissionIds: z.array(UuidSchema).min(1, ERR_ROLE_MUST_HAVE_AT_LEAST_ONE_PERMISSION.message),
});

export const RoleUpdateSchema = z
    .object({
        deletedAt: z.bigint().nullable().optional(),
        deletedById: UuidSchema.nullable().optional(),
        ...RoleCreateSchema.partial().shape,
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: ERR_COMMON_EMPTY_PAYLOAD.message,
    });

export const RoleSearchSchema = z
    .object({
        ...SearchSchema.shape,
        ...RoleCreateSchema.shape,
    })
    .partial();

export type RoleCreateDto = z.infer<typeof RoleCreateSchema>;
export type RoleUpdateDto = z.infer<typeof RoleUpdateSchema>;
export type RoleSearchDto = z.infer<typeof RoleSearchSchema>;
