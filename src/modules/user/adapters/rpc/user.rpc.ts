import { Controller, Inject, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthenticateUserAction } from '@shared/authenticate/authenticate.action';
import { RpcExceptionFilter } from '@shared/filters/rpc-exception.filter';
import { Email, UUID } from '@shared/types/general.type';
import { SharedUser } from '@shared/types/user.shared.type';
import { UserCreateDto } from '@user/domain/model/user.dto';
import { User } from '@user/domain/model/user.model';
import { USER_SERVICE_TOKEN } from '@user/domain/model/user.token';
import { IUserService } from '@user/domain/ports/user-service.interface';

@Controller()
@UseFilters(RpcExceptionFilter)
export class UserRpcController {
    constructor(@Inject(USER_SERVICE_TOKEN) private readonly service: IUserService) {}

    @MessagePattern(AuthenticateUserAction.VALIDATE)
    async validateUser(user: User) {
        return await this.service.getUserValidity(user);
    }

    @MessagePattern(AuthenticateUserAction.CREATE)
    async createUser(payload: UserCreateDto & { password?: string; user: User | SharedUser | undefined }) {
        return await this.service.create(payload, payload.user, payload.password);
    }

    @MessagePattern(AuthenticateUserAction.GET)
    async getUser(payload: { userId: UUID; visibleColumns: (keyof User)[] }) {
        return await this.service.get(payload.userId, payload.visibleColumns);
    }

    @MessagePattern(AuthenticateUserAction.GET_BY_EMAIL)
    async getByEmail(email: Email) {
        return await this.service.findByEmail(email);
    }

    @MessagePattern(AuthenticateUserAction.GET_PASSWORD)
    async getPassword(id: UUID) {
        return await this.service.getPassword(id);
    }

    @MessagePattern(AuthenticateUserAction.CHANGE_PASSWORD)
    async changeUserPassword(id: UUID) {
        throw new Error('Method not implemented.');
    }
}
