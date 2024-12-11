import { Email, UUID } from '@shared/types/general.type';
import { UserValidityResult } from '@shared/types/shared-user.type';
import { AuthChangePasswordDto, AuthUser, AuthUserCreateDto } from './auth.dto';

export interface IAuthUserRepository {
    create(payload: AuthUserCreateDto): Promise<UUID>;

    get(userId: UUID): Promise<AuthUser | null>;

    getByEmail(email: Email): Promise<AuthUser | null>;

    getUserValidity(user: AuthUser): Promise<UserValidityResult>;

    getPassword(userId: UUID): Promise<string>;

    changePassword(userId: UUID, payload: AuthChangePasswordDto): Promise<boolean>;
}
