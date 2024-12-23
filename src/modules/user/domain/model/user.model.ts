import { USER_ROLE, USER_STATUS } from '@shared/enums/shared-user.enum';
import { EmailSchema, UuidSchema } from '@shared/models/general-value-object.model';
import { z } from 'zod';
import { USER_GENDER } from './user.type';

// Permission
export const PermissionSchema = z.object({
    id: UuidSchema,
    name: z.string(),
    description: z.string().nullable().optional(),
    actions: z.array(z.string()),
    slug: z.string(),
    createdAt: z.bigint(),
    updatedAt: z.bigint(),
    deletedAt: z.bigint().nullable().optional(),
});

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
    email: EmailSchema,
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
