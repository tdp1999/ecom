import { Controller, Inject, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IPermissionService } from '@permission/domain/permission-service.interface';
import { PERMISSION_SERVICE_TOKEN } from '@permission/domain/permission.token';
import { RolePermissionAction } from '@shared/actions/role.action';
import { RpcExceptionFilter } from '@shared/filters/rpc-exception.filter';
import { UUID } from '@shared/types/general.type';

@Controller()
@UseFilters(RpcExceptionFilter)
export class PermissionRpcController {
    constructor(@Inject(PERMISSION_SERVICE_TOKEN) private readonly service: IPermissionService) {}

    @MessagePattern(RolePermissionAction.GET)
    async getPermissionForRole(id: UUID) {
        return this.service.get(id);
    }

    @MessagePattern(RolePermissionAction.GET_BY_IDS)
    async getPermissionForRoles(ids: UUID[]) {
        return this.service.getByIds(ids);
    }
}
