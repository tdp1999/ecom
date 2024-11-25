import { PASSWORD_REGEX } from '@shared/constants/regex.constant';
import { ERR_COMMON_INVALID_EMAIL } from '@shared/errors/common-errors';
import { ERR_USER_PASSWORD_INVALID } from '@user/domain/model/user.error';
import { z } from 'zod';

export const UuidSchema = z.string().uuid();
export const EmailSchema = z.string().email(ERR_COMMON_INVALID_EMAIL.message);
export const PasswordSchema = z.string().regex(PASSWORD_REGEX, ERR_USER_PASSWORD_INVALID.message);
