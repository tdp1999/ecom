import { IAuthUserRepository } from '@auth/domain/auth-repository.interface';
import { AuthChangePasswordDto, AuthUser, AuthUserCreateDto } from '@auth/domain/auth.dto';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthUserAction } from '@shared/actions/auth.action';
import { RpcClient } from '@shared/decorators/client.rpc.decorator';
import { Email, UUID } from '@shared/types/general.type';
import { lastValueFrom } from 'rxjs';

export class AuthUserRpcRepository implements IAuthUserRepository {
    constructor(@Inject('AUTH_PROXY') private readonly client: ClientProxy) {}

    @RpcClient()
    async create(payload: AuthUserCreateDto) {
        return await lastValueFrom(this.client.send(AuthUserAction.CREATE, payload));
    }

    async get(userId: UUID): Promise<AuthUser | null> {
        return await lastValueFrom(this.client.send(AuthUserAction.GET, userId));
    }

    async getByEmail(email: Email): Promise<AuthUser | null> {
        return await lastValueFrom(this.client.send(AuthUserAction.GET_BY_EMAIL, email));
    }

    async getPassword(userId: UUID): Promise<string> {
        return await lastValueFrom(this.client.send(AuthUserAction.GET_PASSWORD, userId));
    }

    async changePassword(userId: UUID, payload: AuthChangePasswordDto): Promise<boolean> {
        return await lastValueFrom(this.client.send(AuthUserAction.CHANGE_PASSWORD, { userId, payload }));
    }
}
