import { EmailSchema, PasswordSchema, UuidSchema } from '@shared/models/general-value-object.model';
import { z } from 'zod';

export const AuthRegisterSchema = z.object({ email: EmailSchema, password: PasswordSchema });
export const AuthLoginSchema = AuthRegisterSchema.merge(z.object({}));
export const AuthChangePasswordSchema = z.object({ oldPassword: PasswordSchema, newPassword: PasswordSchema });

export type AuthLoginDto = z.infer<typeof AuthLoginSchema>;
export type AuthRegisterDto = z.infer<typeof AuthRegisterSchema>;
export type AuthChangePasswordDto = z.infer<typeof AuthChangePasswordSchema>;

// RPC
export const AuthUserSchema = z.object({ id: UuidSchema, email: EmailSchema });
export const AuthUserCreateSchema = z.object({ email: EmailSchema, password: PasswordSchema });

export type AuthUser = z.infer<typeof AuthUserSchema>;
export type AuthUserCreateDto = z.infer<typeof AuthUserCreateSchema>;
