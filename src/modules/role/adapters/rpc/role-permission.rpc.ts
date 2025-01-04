import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IRolePermissionRepository } from '@role/domain/role-repository.interface';
import { RolePermissionAction } from '@shared/actions/role.action';
import { CacheFactory } from '@shared/cache/cache.factory';
import { CacheService } from '@shared/cache/cache.interface';
import { RpcClient } from '@shared/decorators/client.rpc.decorator';
import { RolePermission } from '@shared/models/role.model';
import { CLIENT_PROXY } from '@shared/modules/client/client.module';
import { UUID } from '@shared/types/general.type';
import { lastValueFrom } from 'rxjs';

export class RolePermissionRpcRepository implements IRolePermissionRepository {
    private cacheService: CacheService<RolePermission>;

    constructor(@Inject(CLIENT_PROXY) private readonly client: ClientProxy) {
        this.cacheService = CacheFactory.createCacheService<RolePermission>('memory', this);
    }

    @RpcClient()
    load(id: UUID): Promise<RolePermission | null> {
        return this.cacheService.getItem(id);
    }

    @RpcClient()
    loadByIds(ids: UUID[]): Promise<(RolePermission | null)[]> {
        return this.cacheService.getItems(ids);
    }

    async findById(id: UUID): Promise<RolePermission | null> {
        return await lastValueFrom(this.client.send(RolePermissionAction.GET, id));
    }

    async findByIds(ids: UUID[]): Promise<RolePermission[]> {
        return await lastValueFrom(this.client.send(RolePermissionAction.GET_BY_IDS, ids));
    }
}
