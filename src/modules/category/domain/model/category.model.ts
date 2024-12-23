import { STATUS } from '@shared/enums/status.enum';
import { AuditableSchema } from '@shared/models/auditable.model';
import { UuidSchema } from '@shared/models/general-value-object.model';
import { z } from 'zod';

// Value Objects
export const CategoryId = UuidSchema;

export const CategoryMetadata = z.object({
    description: z.string().optional(),
    displayOrder: z.number().int().min(0).optional(),
    icon: z.string().url().optional(),
    image: z.string().optional(),
    slug: z.string().optional(),
});

// Entities
export const CategorySchema = z.object({
    id: CategoryId,
    name: z.string(),
    isGroup: z.boolean(),
    isClickable: z.boolean(),
    metadata: CategoryMetadata,

    status: z.nativeEnum(STATUS),

    parentId: CategoryId.nullable().optional(),

    parent: z.any().optional(),
    children: z.array(z.any()).optional(),

    ...AuditableSchema.shape,
});

export type CategoryMetadata = z.infer<typeof CategoryMetadata>;
export type Category = z.infer<typeof CategorySchema>;
