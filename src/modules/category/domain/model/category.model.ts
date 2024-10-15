import { STATUS } from '@shared/enums/status.enum';
import { z } from 'zod';

export const CategorySchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(3),
    image: z.string().optional(),
    description: z.string().optional(),
    position: z.number().min(0).default(0),
    parentId: z.string().uuid().nullable().optional(),
    children: z.array(z.string().uuid()).optional().default([]),
    status: z.nativeEnum(STATUS),

    // For soft delete
    isDeleted: z.boolean().default(false),

    createdAt: z.date(),
    updatedAt: z.date(),
});

export type Category = z.infer<typeof CategorySchema>;
