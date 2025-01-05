import { IJwtData, IJwtPayload } from '@shared/authenticate/authenticate.type';

export interface IJwtService {
    generatePayload(iss: string, sub: string, email: string): IJwtPayload;

    sign(payload: IJwtPayload): Promise<string>;

    verify(token: string): Promise<IJwtData>;
}
