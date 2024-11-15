import { z } from 'zod';
import { ORDER_TYPE } from '../enums/status.enum';

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
    createdAt: z.bigint().optional(),
    updatedAt: z.bigint().optional(),

    // Arbitrary
    // status: z.nativeEnum(STATUS).optional(),
});

export type SearchDto = z.infer<typeof SearchSchema>;
