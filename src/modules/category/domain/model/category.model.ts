import { STATUS } from '@shared/enums/status.enum';
import { z } from 'zod';

// Value Objects
export const CategoryId = z.string().uuid();

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

    createdAt: z.bigint(),
    updatedAt: z.bigint(),
    deletedAt: z.bigint().nullable().optional(),

    parentId: CategoryId.nullable().optional(),
    parent: z.any().optional(),
    children: z.array(z.any()).optional(),
});

export const CategoryClosure = z.object({
    ancestorId: CategoryId,
    descendantId: CategoryId,
    depth: z.number().int().min(0),
});

export type CategoryMetadata = z.infer<typeof CategoryMetadata>;
export type Category = z.infer<typeof CategorySchema>;
export type CategoryClosure = z.infer<typeof CategoryClosure>;
