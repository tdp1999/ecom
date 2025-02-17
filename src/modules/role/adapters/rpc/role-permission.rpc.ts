import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IRolePermissionRepository } from '@role/domain/role-repository.interface';
import { RolePermissionAction } from '@shared/actions/role.action';
import { CacheFactory } from '@shared/cache/cache.factory';
import { CacheRepository, CacheService } from '@shared/cache/cache.interface';
import { RpcClient } from '@shared/decorators/client.rpc.decorator';
import { RolePermission } from '@shared/models/role.model';
import { CLIENT_PROXY } from '@shared/modules/client/client.module';
import { UUID } from '@shared/types/general.type';
import { lastValueFrom } from 'rxjs';

export class RolePermissionRpcRepository implements IRolePermissionRepository, CacheRepository<RolePermission> {
    private cacheService: CacheService<RolePermission>;

    constructor(@Inject(CLIENT_PROXY) private readonly client: ClientProxy) {
        this.cacheService = CacheFactory.createCacheService<RolePermission>('memory', this);
    }

    load(id: UUID): Promise<RolePermission | null> {
        return this.cacheService.getItem(id);
    }

    loadByIds(ids: UUID[]): Promise<(RolePermission | null)[]> {
        return this.cacheService.getItems(ids);
    }

    @RpcClient()
    async findById(id: UUID): Promise<RolePermission | null> {
        return await lastValueFrom(this.client.send(RolePermissionAction.GET, id));
    }

    @RpcClient()
    async findByIds(ids: UUID[]): Promise<RolePermission[]> {
        return await lastValueFrom(this.client.send(RolePermissionAction.GET_BY_IDS, ids));
    }
}
