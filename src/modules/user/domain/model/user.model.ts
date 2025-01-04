import { USER_STATUS } from '@shared/enums/shared-user.enum';
import { AuditableSchema } from '@shared/models/auditable.model';
import { EmailSchema, UuidSchema } from '@shared/models/general-value-object.model';
import { z } from 'zod';
import { USER_GENDER } from './user.type';

// User Role
export const UserRoleSchema = z.object({
    id: UuidSchema,
    name: z.string(),
    permissions: z.object({ id: UuidSchema, slug: z.string() }),
});

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
    roleId: UuidSchema.optional().nullable(),

    ...AuditableSchema.shape,
});

export type UserRole = z.infer<typeof UserRoleSchema>;
export type User = z.infer<typeof UserSchema> & { role?: UserRole };
export type UserProfile = z.infer<typeof UserProfileSchema>;
