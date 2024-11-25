import { z } from 'zod';
import { EmailSchema, PasswordSchema, UuidSchema } from '../models/general-value-object.model';

export type UUID = z.infer<typeof UuidSchema>;
export type Email = z.infer<typeof EmailSchema>;
export type Password = z.infer<typeof PasswordSchema>
