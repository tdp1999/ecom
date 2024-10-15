import { z } from 'zod';
import { ORDER_TYPE, STATUS } from '../enums/status.enum';

export const SearchSchema = z.object({
    // General search
    key: z.string().trim().optional(),

    // Pagination
    limit: z.coerce.number().min(1).optional(),
    page: z.coerce.number().min(1).optional(),

    // Sort
    orderBy: z.string().optional(),
    orderType: z.string().toLowerCase().pipe(z.nativeEnum(ORDER_TYPE)).optional(),

    // Timestamp
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),

    // Arbitrary
    status: z.nativeEnum(STATUS).optional().default(STATUS.ACTIVE),
});

export type SearchDto = z.infer<typeof SearchSchema>;
