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

export const PersistenceToAuditableSchema = z
    .object({
        createdAt: z.string().transform(BigInt).or(z.bigint()),
        updatedAt: z.string().transform(BigInt).or(z.bigint()),
        deletedAt: z.string().transform(BigInt).or(z.bigint()).nullable().optional(),
    })
    .merge(z.object({}));
