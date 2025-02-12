import { IAuthUserRepository } from '@auth/domain/auth-repository.interface';
import { AuthChangePasswordDto, AuthUser, AuthUserCreateDto } from '@auth/domain/auth.dto';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthenticateUserAction } from '@shared/authenticate/authenticate.action';
import { RpcClient } from '@shared/decorators/client.rpc.decorator';
import { User } from '@shared/decorators/user.decorator';
import { CLIENT_PROXY } from '@shared/modules/client/client.module';
import { Email, UUID } from '@shared/types/general.type';
import { SharedUser, UserValidityResult } from '@shared/types/user.shared.type';
import { lastValueFrom } from 'rxjs';

export class AuthUserRpcRepository implements IAuthUserRepository {
    constructor(@Inject(CLIENT_PROXY) private readonly client: ClientProxy) {}

    @RpcClient()
    async create(payload: AuthUserCreateDto, @User() user: SharedUser | undefined) {
        return await lastValueFrom(this.client.send(AuthenticateUserAction.CREATE, { ...payload, user }));
    }

    async get(userId: UUID): Promise<AuthUser | null> {
        return await lastValueFrom(this.client.send(AuthenticateUserAction.GET, { userId, visibleColumns: [] }));
    }

    async getByEmail(email: Email): Promise<AuthUser | null> {
        return await lastValueFrom(this.client.send(AuthenticateUserAction.GET_BY_EMAIL, email));
    }

    @RpcClient()
    async getUserValidity(user: AuthUser): Promise<UserValidityResult> {
        return await lastValueFrom(this.client.send(AuthenticateUserAction.VALIDATE, user));
    }

    async getPassword(userId: UUID): Promise<string> {
        return await lastValueFrom(this.client.send(AuthenticateUserAction.GET_PASSWORD, userId));
    }

    async changePassword(userId: UUID, payload: AuthChangePasswordDto): Promise<boolean> {
        return await lastValueFrom(this.client.send(AuthenticateUserAction.CHANGE_PASSWORD, { userId, payload }));
    }
}
