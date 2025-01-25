import { IJwtData } from '@shared/authenticate/authenticate.type';
import { UUID } from '@shared/types/general.type';
import { SharedUser } from '@shared/types/user.shared.type';
import { AuthChangePasswordDto, AuthLoginDto, AuthRegisterDto } from './auth.dto';

export interface ILoginResponse {
    accessToken: string;
    // refresh_token: string;
}

export interface IAuthService {
    register(credentials: AuthRegisterDto, user?: SharedUser): Promise<boolean>;

    login(data: AuthLoginDto, user?: SharedUser): Promise<ILoginResponse>;

    changePassword(userId: UUID, payload: AuthChangePasswordDto): Promise<boolean>;

    verify(token: string): Promise<IJwtData>;
}
