import { UuidSchema } from '@shared/models/general-value-object.model';
import { z } from 'zod';

export const SharedUserSchema = z.object({
    id: UuidSchema,
    email: z.string().email(),
});
