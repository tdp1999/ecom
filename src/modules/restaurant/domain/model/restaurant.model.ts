import { z } from 'zod';
import { STATUS } from '@shared/enums/status.enum';

export const RestaurantSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    address: z.string(),
    phone: z.string(),
    coverImages: z.array(z.string()).min(1).optional(),
    images: z.array(z.string()).min(1).optional(),
    shortIntroduction: z.string().optional(),
    description: z.string().optional(),
    geometry: z
        .object({
            type: z.literal('Point'),
            coordinates: z.tuple([z.number(), z.number()]),
        })
        .optional(),
    rating: z.number(),
    ratingCount: z.number(),
    categories: z.array(z.string()).min(1).optional(),
    specifications: z.array(z.string()).min(1).optional(),
    status: z.nativeEnum(STATUS),

    // For soft delete
    isDeleted: z.boolean().default(false),

    createdAt: z.bigint(),
    updatedAt: z.bigint(),
});

export type Restaurant = z.infer<typeof RestaurantSchema>;
