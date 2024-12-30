import { USER_STATUS } from '@shared/enums/shared-user.enum';
import { AuditableSchema } from '@shared/models/auditable.model';
import { EmailSchema, UuidSchema } from '@shared/models/general-value-object.model';
import { z } from 'zod';
import { USER_GENDER } from './user.type';

// User Profile Schema (less frequently accessed, profile-related)
export const UserProfileSchema = z.object({
    id: UuidSchema,
    firstName: z.string(),
    lastName: z.string(),
    avatar: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    birthday: z.bigint().nullable().optional(),
    gender: z.nativeEnum(USER_GENDER).nullable().optional(),
});

// Core User Schema (frequently accessed, authentication-related)
export const UserSchema = z.object({
    id: UuidSchema,
    email: EmailSchema,
    password: z.string(),
    salt: z.string(),

    isSystem: z.boolean().optional().default(false),
    status: z.nativeEnum(USER_STATUS),

    ...AuditableSchema.shape,
});

export type User = z.infer<typeof UserSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
