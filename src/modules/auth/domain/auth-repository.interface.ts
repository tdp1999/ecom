import { Email, UUID } from '@shared/types/general.type';
import { AuthChangePasswordDto, AuthUser, AuthUserCreateDto } from './auth.dto';

export interface IAuthUserRepository {
    // create(payload: AuthUserCreateDto): Observable<UUID>;
    create(payload: AuthUserCreateDto): Promise<UUID>;

    get(userId: UUID): Promise<AuthUser | null>;

    getByEmail(email: Email): Promise<AuthUser | null>;

    getPassword(userId: UUID): Promise<string>;

    changePassword(userId: UUID, payload: AuthChangePasswordDto): Promise<boolean>;
}
