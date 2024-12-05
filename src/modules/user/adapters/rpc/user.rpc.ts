import { Controller, Inject, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthUserAction } from '@shared/actions/auth.action';
import { RpcExceptionFilter } from '@shared/filters/rpc-exception.filter';
import { Email, UUID } from '@shared/types/general.type';
import { UserCreateDto } from '@user/domain/model/user.dto';
import { USER_SERVICE_TOKEN } from '@user/domain/model/user.token';
import { IUserService } from '@user/domain/ports/user-service.interface';

@Controller()
export class UserRpcController {
    constructor(@Inject(USER_SERVICE_TOKEN) private readonly service: IUserService) {}

    @MessagePattern(AuthUserAction.VALIDATE)
    async validateUser(id: UUID) {
        throw new Error('Method not implemented.');
    }

    @UseFilters(RpcExceptionFilter)
    @MessagePattern(AuthUserAction.CREATE)
    async createUser(payload: UserCreateDto & { password?: string }) {
        return await this.service.create(payload, payload.password);
    }

    @MessagePattern(AuthUserAction.GET)
    async getUser(id: UUID) {
        return await this.service.get(id);
    }

    @MessagePattern(AuthUserAction.GET_BY_EMAIL)
    async getByEmail(email: Email) {
        return await this.service.findByEmail(email);
    }

    @MessagePattern(AuthUserAction.GET_PASSWORD)
    async getPassword(id: UUID) {
        return await this.service.getPassword(id);
    }

    @MessagePattern(AuthUserAction.CHANGE_PASSWORD)
    async changeUserPassword(id: UUID) {
        throw new Error('Method not implemented.');
    }
}