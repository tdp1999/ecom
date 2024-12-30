import { AuditableSchema } from '@shared/models/auditable.model';
import { UuidSchema } from '@shared/models/general-value-object.model';
import { z } from 'zod';

// Permission
export const PermissionSchema = z.object({
    id: UuidSchema,
    name: z.string(),
    description: z.string().nullable().optional(),
    resource: z.string(),
    action: z.string(),
    slug: z.string(),

    ...AuditableSchema.shape,
});

export type Permission = z.infer<typeof PermissionSchema>;
export type PermissionItem = Pick<Permission, 'name' | 'description' | 'resource' | 'action'>;
