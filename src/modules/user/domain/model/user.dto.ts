import { SearchSchema } from '@shared/dtos/seach.dto';
import { ERR_COMMON_EMPTY_PAYLOAD } from '@shared/errors/common-errors';
import { EmailSchema } from '@shared/models/general-value-object.model';
import { z } from 'zod';
import { USER_GENDER, USER_ROLE, USER_STATUS } from './user.type';

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

export const UserCreateSchema = z.object({
    email: EmailSchema,
    role: z.nativeEnum(USER_ROLE).default(USER_ROLE.USER),
    status: z.nativeEnum(USER_STATUS).default(USER_STATUS.PENDING),
    profile: UserProfileUpdateSchema.partial().nullable().optional(),
});

export const UserUpdateSchema = z
    .object({
        deletedAt: z.bigint().nullable().optional(),
    })
    .merge(UserCreateSchema.partial())
    .refine((data) => Object.keys(data).length > 0, {
        message: ERR_COMMON_EMPTY_PAYLOAD.message,
    });

export const UserSearchSchema = SearchSchema.merge(
    UserCreateSchema.pick({
        email: true,
        status: true,
        role: true,
    }).merge(
        z.object({
            profile: UserProfileUpdateSchema.pick({
                firstName: true,
                lastName: true,
                address: true,
            }),
        }),
    ),
).partial();

export type UserCreateDto = z.infer<typeof UserCreateSchema>;
export type UserUpdateDto = z.infer<typeof UserUpdateSchema>;
export type UserSearchDto = z.infer<typeof UserSearchSchema>;
