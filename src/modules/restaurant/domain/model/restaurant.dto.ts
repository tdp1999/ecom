import { SearchSchema } from '@shared/dtos/seach.dto';
import { STATUS } from '@shared/enums/status.enum';
import { z } from 'zod';
import { ERR_COMMON_EMPTY_PAYLOAD } from '@shared/errors/common-errors';

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

export const RestaurantUpdateSchema = z
    .object({
        isDeleted: z.boolean().optional().default(false),
    })
    .merge(RestaurantCreateSchema.partial())
    .refine((data) => Object.keys(data).length > 0, {
        message: ERR_COMMON_EMPTY_PAYLOAD.message,
    });

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
