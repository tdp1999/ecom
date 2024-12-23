import { STATUS } from '@shared/enums/status.enum';
import { AuditableSchema } from '@shared/models/auditable.model';
import { UuidSchema } from '@shared/models/general-value-object.model';
import { z } from 'zod';

export const BrandSchema = z.object({
    id: UuidSchema,
    name: z.string(),
    image: z.string().optional(),
    description: z.string().optional(),
    tagLine: z.string().optional(),
    status: z.nativeEnum(STATUS),

    ...AuditableSchema.shape,
});

export type Brand = z.infer<typeof BrandSchema>;
