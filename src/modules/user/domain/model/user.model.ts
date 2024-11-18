import { UuidSchema } from '@shared/models/general-value-object.model';
import { USER_GENDER, USER_ROLE, USER_STATUS } from './user.type';
import { z } from 'zod';

// User Profile Schema (less frequently accessed, profile-related)
export const UserProfileSchema = z.object({
    id: UuidSchema,
    // userId: UuidSchema, // Reference to main user
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
    email: z.string().email(),
    password: z.string(),
    salt: z.string(),

    role: z.nativeEnum(USER_ROLE),
    status: z.nativeEnum(USER_STATUS),
    createdAt: z.bigint(),
    updatedAt: z.bigint(),
    deletedAt: z.bigint().nullable().optional(),

    // profile: UserProfileSchema.nullable().optional(),
});

export type User = z.infer<typeof UserSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
