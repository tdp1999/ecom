import { IAuthService } from '@auth/domain/auth-service.interface';
import { AUTH_SERVICE_TOKEN } from '@auth/domain/auth.token';
import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthAction } from '@shared/auth/auth.action';
import { IJwtData } from '@shared/auth/auth.type';

@Controller()
export class AuthRpcController {
    constructor(@Inject(AUTH_SERVICE_TOKEN) private readonly service: IAuthService) {}

    @MessagePattern(AuthAction.VERIFY)
    async verify(token: string): Promise<IJwtData> {
        return await this.service.verify(token);
    }
}
