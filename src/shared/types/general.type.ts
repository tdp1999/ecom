import { z } from 'zod';
import { UuidSchema } from '../models/general-value-object.model';

export type UUID = z.infer<typeof UuidSchema>;
