import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserRoleAction } from '@shared/actions/user.action';
import { RpcClient } from '@shared/decorators/client.rpc.decorator';
import { CLIENT_PROXY } from '@shared/modules/client/client.module';
import { UUID } from '@shared/types/general.type';
import { IUserRoleRepository } from '@user/domain/ports/user-repository.interface';
import { lastValueFrom } from 'rxjs';

export class UserRoleRpcRepository implements IUserRoleRepository {
    constructor(@Inject(CLIENT_PROXY) private readonly client: ClientProxy) {}

    @RpcClient()
    async getById(id: UUID) {
        return await lastValueFrom(this.client.send(UserRoleAction.GET, id));
    }
}
