import { IJwtData } from '@shared/types/auth.type';
import { UUID } from '@shared/types/general.type';
import { AuthChangePasswordDto, AuthLoginDto, AuthRegisterDto } from './auth.dto';

export interface ILoginResponse {
    accessToken: string;
    // refresh_token: string;
}

export interface IAuthService {
    register(credentials: AuthRegisterDto): Promise<boolean>;

    login(data: AuthLoginDto): Promise<ILoginResponse>;

    changePassword(userId: UUID, payload: AuthChangePasswordDto): Promise<boolean>;

    verify(token: string): Promise<IJwtData>;
}
