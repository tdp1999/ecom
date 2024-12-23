import { Email, UUID } from '@shared/types/general.type';
import { SharedUser, UserValidityResult } from '@shared/types/user.shared.type';
import { AuthChangePasswordDto, AuthUser, AuthUserCreateDto } from './auth.dto';

export interface IAuthUserRepository {
    create(payload: AuthUserCreateDto, user?: SharedUser): Promise<UUID>;

    get(userId: UUID): Promise<AuthUser | null>;

    getByEmail(email: Email): Promise<AuthUser | null>;

    getUserValidity(user: AuthUser): Promise<UserValidityResult>;

    getPassword(userId: UUID): Promise<string>;

    changePassword(userId: UUID, payload: AuthChangePasswordDto): Promise<boolean>;
}
