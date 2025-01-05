import { IAuthService } from '@auth/domain/auth-service.interface';
import { AUTH_SERVICE_TOKEN } from '@auth/domain/auth.token';
import { Controller, Inject, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthenticateAction } from '@shared/authenticate/authenticate.action';
import { IJwtData } from '@shared/authenticate/authenticate.type';
import { RpcExceptionFilter } from '@shared/filters/rpc-exception.filter';

@Controller()
@UseFilters(RpcExceptionFilter)
export class AuthRpcController {
    constructor(@Inject(AUTH_SERVICE_TOKEN) private readonly service: IAuthService) {}

    @MessagePattern(AuthenticateAction.VERIFY)
    async verify(token: string): Promise<IJwtData> {
        return await this.service.verify(token);
    }
}
