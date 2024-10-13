import { z } from 'zod';
import { STATUS } from '@shared/enums/status.enum';
import { SearchSchema } from '@shared/dtos/seach.dto';

export const RestaurantCreateSchema = z.object({
    name: z.string(),
    address: z.string(),
    phone: z.string(),
    coverImages: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
    shortIntroduction: z.string().max(255).optional(),
    description: z.string().optional(),
    geometry: z
        .object({
            type: z.literal('Point'),
            coordinates: z.tuple([z.number(), z.number()]),
        })
        .optional(),
    rating: z.number().optional().default(0),
    ratingCount: z.number().optional().default(0),
    categories: z.array(z.string()).min(1).optional(),
    specifications: z.array(z.string()).min(1).optional(),
    status: z.nativeEnum(STATUS).optional().default(STATUS.ACTIVE),
});

export const RestaurantUpdateSchema = RestaurantCreateSchema.partial();

export const RestaurantSearchSchema = SearchSchema.merge(
    RestaurantCreateSchema.pick({
        name: true,
        address: true,
        categories: true,
        status: true,
    }).partial(),
);

export type RestaurantCreateDto = z.infer<typeof RestaurantCreateSchema>;
export type RestaurantUpdateDto = z.infer<typeof RestaurantUpdateSchema>;
export type RestaurantSearchDto = z.infer<typeof RestaurantSearchSchema>;
