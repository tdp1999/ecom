import { STATUS } from '@shared/enums/status.enum';
import { UuidSchema } from '@shared/models/general-value-object.model';
import { z } from 'zod';

export const BrandSchema = z.object({
    id: UuidSchema,
    name: z.string(),
    image: z.string().optional(),
    description: z.string().optional(),
    tagLine: z.string().optional(),
    status: z.nativeEnum(STATUS),

    createdAt: z.bigint(),
    updatedAt: z.bigint(),
    deletedAt: z.bigint().nullable().optional(),

    // ...AuditableSchema.shape,
});

export type Brand = z.infer<typeof BrandSchema>;
