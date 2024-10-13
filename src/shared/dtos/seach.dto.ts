import { z } from 'zod';
import { ORDER_TYPE } from '../enums/status.enum';

export const SearchSchema = z.object({
    // General search
    key: z.string().trim().optional(),

    // Pagination
    limit: z.number().optional(),
    page: z.number().optional(),

    // Sort
    orderBy: z.string().optional(),
    orderType: z
        .string()
        .toLowerCase()
        .pipe(z.nativeEnum(ORDER_TYPE))
        .optional(),

    // Timestamp
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
});

export type SearchDto = z.infer<typeof SearchSchema>;
