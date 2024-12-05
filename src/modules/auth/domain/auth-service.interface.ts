import { Email, Password, UUID } from '@shared/types/general.type';
import { AuthChangePasswordDto, AuthLoginDto, AuthRegisterDto } from './auth.dto';
import { AuthTokenPayload, AuthTokens } from './auth.type';

export interface ILoginResponse {
    accessToken: string;
    // refresh_token: string;
}

export interface IAuthService {
    register(credentials: AuthRegisterDto): Promise<boolean>;

    login(data: AuthLoginDto): Promise<ILoginResponse>;

    changePassword(userId: UUID, payload: AuthChangePasswordDto): Promise<boolean>;

    validateUser(email: Email, password: Password): Promise<any>;

    generateTokens(userId: UUID): Promise<AuthTokens>;

    verifyToken(token: string): Promise<AuthTokenPayload>;
}
