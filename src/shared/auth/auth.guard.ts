import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { AuthAction, AuthUserAction } from '@shared/auth/auth.action';
import { USER_STATUS } from '@shared/enums/shared-user.enum';
import { ERR_COMMON_FORBIDDEN_ACCOUNT, ERR_COMMON_UNAUTHORIZED } from '@shared/errors/common-errors';
import { ForbiddenError, UnauthorizedError } from '@shared/errors/domain-error';
import { CLIENT_PROXY } from '@shared/modules/client/client.module';
import { METADATA_PUBLIC } from '@shared/auth/auth.token';
import { IJwtData } from '@shared/auth/auth.type';
import { UserValidityResult } from '@shared/types/shared-user.type';
import { catchError, lastValueFrom, of } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @Inject(CLIENT_PROXY) private readonly client: ClientProxy,
    ) {}

    async canActivate(context: ExecutionContext) {
        // Check for public routes
        const isPublic = this.reflector.getAllAndOverride(METADATA_PUBLIC, [context.getHandler(), context.getClass()]);
        if (isPublic) return true;

        // Check if token is valid
        const req =
            context.getType() === 'http' ? context.switchToHttp().getRequest() : context.switchToRpc().getContext();
        const authorization =
            req.headers?.['authorization'] || req?.getHeaders?.()?.headers?.get('authorization')[0] || '';
        const accessToken = authorization?.replace('Bearer ', '');
        const tokenData = await lastValueFrom(
            this.client.send<IJwtData>(AuthAction.VERIFY, accessToken).pipe(catchError(() => of(null))),
        );
        if (!tokenData) throw UnauthorizedError(ERR_COMMON_UNAUTHORIZED.message);

        // Check if user is valid
        const userId = tokenData.sub;
        const user = await lastValueFrom(this.client.send<Record<string, any>>(AuthUserAction.GET, userId));
        if (!user) throw UnauthorizedError(ERR_COMMON_UNAUTHORIZED.message);

        // Attach user to request
        req.user = user;

        // Check if user account is valid
        const result = await lastValueFrom(this.client.send<UserValidityResult>(AuthUserAction.VALIDATE, user));
        if (result.isValid) return true;
        if (result.status === USER_STATUS.DELETED) throw UnauthorizedError(ERR_COMMON_UNAUTHORIZED.message);
        throw ForbiddenError(result.invalidMessage || ERR_COMMON_FORBIDDEN_ACCOUNT.message);
    }
}
