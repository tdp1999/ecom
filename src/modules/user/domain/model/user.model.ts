import { ERR_ADDRESS_LENGTH_EXCEEDED } from '@address/domain/address.error';
import { ADDRESS_TYPE } from '@address/domain/address.type';
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

// User Address (Resemble Billing Address)
export const UserAddressSchema = z.object({
    id: UuidSchema,
    name: z.string(),
    phone: z.string(),
    userId: UuidSchema,
    isDefault: z.boolean().default(false),

    // This might be become an id in the future
    country: z.string(),
    stateOrProvince: z.string(),
    city: z.string(),
    address1: z.string(),
    address2: z.string().nullable().optional(),
    addressType: z.nativeEnum(ADDRESS_TYPE).optional().default(ADDRESS_TYPE.OTHER),
    remarks: z.string().nullable().optional(),

    // TODO: Add lat, long to address

    ...AuditableSchema.shape,
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
export type UserAddress = z.infer<typeof UserAddressSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type User = z.infer<typeof UserSchema> & { role?: UserRole; addresses?: UserAddress[]; profile?: UserProfile };
