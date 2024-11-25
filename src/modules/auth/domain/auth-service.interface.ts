import { Email, Password, UUID } from '@shared/types/general.type';
import { AuthChangePasswordDto, AuthLoginDto, AuthRegisterDto } from './auth.dto';
import { AuthTokenPayload, AuthTokens } from './auth.type';

export interface IAuthService {
    register(credentials: AuthLoginDto): Promise<boolean>;

    login(data: AuthRegisterDto): Promise<string>;

    changePassword(userId: UUID, payload: AuthChangePasswordDto): Promise<boolean>;

    validateUser(email: Email, password: Password): Promise<any>;

    generateTokens(userId: UUID): Promise<AuthTokens>;

    verifyToken(token: string): Promise<AuthTokenPayload>;
}
