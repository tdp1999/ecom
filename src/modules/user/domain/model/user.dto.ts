import { ADDRESS_TYPE } from '@address/domain/address.type';
import { SearchSchema } from '@shared/dtos/seach.dto';
import { USER_STATUS } from '@shared/enums/shared-user.enum';
import { ERR_COMMON_EMPTY_PAYLOAD } from '@shared/errors/common-errors';
import { EmailSchema, UuidSchema } from '@shared/models/general-value-object.model';
import { USER_ADDRESS_MAX_LENGTH } from '@user/domain/model/user.constant';
import { z } from 'zod';
import { USER_GENDER } from './user.type';

export const UserProfileUpdateSchema = z.object({
    // No need to require user id, because it will be handled in the repository
    firstName: z.string({ message: 'This is required!' }),
    lastName: z.string({ message: 'This is required' }),
    avatar: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    birthday: z.bigint().nullable().optional(),
    gender: z.nativeEnum(USER_GENDER).nullable().optional(),
});

export const UserAddressCreateSchema = z.object({
    name: z.string(),
    phone: z.string(),
    userId: UuidSchema,
    isDefault: z.boolean().default(false),
    country: z.string(),
    stateOrProvince: z.string(),
    city: z.string(),
    address1: z.string().max(USER_ADDRESS_MAX_LENGTH),
    address2: z.string().max(USER_ADDRESS_MAX_LENGTH).nullable().optional(),
    addressType: z.nativeEnum(ADDRESS_TYPE).optional().default(ADDRESS_TYPE.OTHER),
    remarks: z.string().nullable().optional(),
});

export const UserAddressUpdateSchema = z
    .object({
        deletedAt: z.bigint().nullable().optional(),
        deletedById: UuidSchema.nullable().optional(),
    })
    .merge(UserAddressCreateSchema.omit({ userId: true }).partial())
    .refine((data) => Object.keys(data).length > 0, {
        message: ERR_COMMON_EMPTY_PAYLOAD.message,
    });

export const UserCreateSchema = z.object({
    email: EmailSchema,
    isSystem: z.boolean().optional().default(false),
    status: z.nativeEnum(USER_STATUS).default(USER_STATUS.PENDING),
    profile: UserProfileUpdateSchema.partial().nullable().optional(),
    roleId: UuidSchema.nullable().optional(),
});

export const UserUpdateSchema = z
    .object({
        deletedAt: z.bigint().nullable().optional(),
        deletedById: UuidSchema.nullable().optional(),
    })
    .merge(UserCreateSchema.partial())
    .refine((data) => Object.keys(data).length > 0, {
        message: ERR_COMMON_EMPTY_PAYLOAD.message,
    });

export const UserSearchSchema = SearchSchema.merge(
    UserCreateSchema.pick({
        email: true,
        status: true,
    }).merge(
        z.object({
            profile: UserProfileUpdateSchema.pick({
                firstName: true,
                lastName: true,
                address: true,
            })
                .partial()
                .nullable(),
        }),
    ),
).partial();

export type UserCreateDto = z.infer<typeof UserCreateSchema>;
export type UserUpdateDto = z.infer<typeof UserUpdateSchema>;
export type UserSearchDto = z.infer<typeof UserSearchSchema>;
export type UserAddressCreateDto = z.infer<typeof UserAddressCreateSchema>;
export type UserAddressUpdateDto = z.infer<typeof UserAddressUpdateSchema>;
