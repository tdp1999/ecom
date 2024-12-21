import { UuidSchema } from '@shared/models/general-value-object.model';
import { z } from 'zod';

export const AuditableSchema = z.object({
    createdAt: z.bigint(),
    createdById: UuidSchema,

    updatedAt: z.bigint(),
    updatedById: UuidSchema,

    deletedAt: z.bigint().nullable().optional(),
    deletedById: UuidSchema.nullable().optional(),
});
