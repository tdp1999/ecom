import { Controller, Inject, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IRoleService } from '@role/domain/role-service.interface';
import { ROLE_SERVICE_TOKEN } from '@role/domain/role.token';
import { UserRoleAction } from '@shared/actions/user.action';
import { RpcExceptionFilter } from '@shared/filters/rpc-exception.filter';
import { UUID } from '@shared/types/general.type';

@Controller()
@UseFilters(RpcExceptionFilter)
export class RoleRpcController {
    constructor(@Inject(ROLE_SERVICE_TOKEN) private readonly service: IRoleService) {}

    @MessagePattern(UserRoleAction.GET)
    async getRoleForUser(id: UUID) {
        return await this.service.get(id);
    }
}
