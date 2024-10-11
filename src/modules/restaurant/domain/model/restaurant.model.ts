import { z } from 'zod';
import { STATUS } from '@shared/constants/status.constant';

export const RestaurantSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  coverImages: z.array(z.string()).min(1),
  images: z.array(z.string()).min(1),
  shortIntroduction: z.string().optional(),
  description: z.string().optional(),
  geometry: z
    .object({
      type: z.literal('Point'),
      coordinates: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  rating: z.number().default(0),
  ratingCount: z.number().default(0),
  categories: z.array(z.string()).min(1),
  specifications: z.array(z.string()).min(1),
  status: z.enum(STATUS),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Restaurant = z.infer<typeof RestaurantSchema>;
