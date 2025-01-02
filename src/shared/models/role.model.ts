import { AuditableSchema } from '@shared/models/auditable.model';
import { UuidSchema } from '@shared/models/general-value-object.model';
import { Permission } from '@shared/models/permission.model';
import { z } from 'zod';

export const RolePermissionSchema = z.object({
    id: UuidSchema,
    name: z.string(),
    description: z.string().nullable().optional(),
    resource: z.string(),
    action: z.string(),
    slug: z.string(),
});

export const RoleSchema = z.object({
    id: UuidSchema,
    name: z.string(),
    description: z.string().nullable().optional(),
    permissionIds: z.array(UuidSchema),
    ...AuditableSchema.shape,
});

export type Role = z.infer<typeof RoleSchema> & { permissions?: Permission[] };
export type RolePermission = z.infer<typeof RolePermissionSchema>;
