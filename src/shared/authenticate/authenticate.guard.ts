import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { AuthenticateAction, AuthenticateUserAction } from '@shared/authenticate/authenticate.action';
import { METADATA_PUBLIC, METADATA_REQUIRE_NO_AUTH } from '@shared/authenticate/authenticate.token';
import { IJwtData } from '@shared/authenticate/authenticate.type';
import { USER_STATUS } from '@shared/enums/shared-user.enum';
import { ERR_COMMON_FORBIDDEN_ACCOUNT, ERR_COMMON_UNAUTHORIZED } from '@shared/errors/common-errors';
import { ForbiddenError, UnauthorizedError } from '@shared/errors/domain-error';
import { CLIENT_PROXY } from '@shared/modules/client/client.module';
import { UserValidityResult } from '@shared/types/user.shared.type';
import { catchError, lastValueFrom, of } from 'rxjs';

@Injectable()
export class AuthenticateGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @Inject(CLIENT_PROXY) private readonly client: ClientProxy,
    ) {}

    async canActivate(context: ExecutionContext) {
        // Check for public routes
        const isPublic = this.reflector.getAllAndOverride(METADATA_PUBLIC, [context.getHandler(), context.getClass()]);
        if (isPublic) return true;

        const req =
            context.getType() === 'http' ? context.switchToHttp().getRequest() : context.switchToRpc().getContext();
        const authorization =
            req.headers?.['authorization'] || req?.getHeaders?.()?.headers?.get('authorization')[0] || '';
        const accessToken = authorization?.replace('Bearer ', '');

        // Check for required no auth routes, like login, register, etc.
        const isRequiredNoAuth = this.reflector.getAllAndOverride(METADATA_REQUIRE_NO_AUTH, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isRequiredNoAuth) {
            // This should be doing in the FE side!!
            // if (!!accessToken)
            //     throw BadRequestError(ERR_AUTHORIZE_REQUIRE_NO_AUTHORIZATION.message, { remarks: `Token found` });

            return true;
        }

        // Check if token is valid
        const tokenData = await lastValueFrom(
            this.client.send<IJwtData>(AuthenticateAction.VERIFY, accessToken).pipe(catchError(() => of(null))),
        );
        if (!tokenData)
            throw UnauthorizedError(ERR_COMMON_UNAUTHORIZED.message, { remarks: 'Token not found or invalid' });

        // Check if user is valid
        const userId = tokenData.sub;
        const user = await lastValueFrom(
            this.client.send<Record<string, any>>(AuthenticateUserAction.GET, { userId, visibleColumns: [] }),
        );
        if (!user) throw UnauthorizedError(ERR_COMMON_UNAUTHORIZED.message, { remarks: 'User not found' });

        // Attach user to request
        req.user = user;

        // Check if user account is valid
        const result = await lastValueFrom(this.client.send<UserValidityResult>(AuthenticateUserAction.VALIDATE, user));
        if (result.isValid) return true;
        if (result.status === USER_STATUS.DELETED)
            throw UnauthorizedError(ERR_COMMON_UNAUTHORIZED.message, { remarks: 'User deleted' });
        throw ForbiddenError(result.invalidMessage || ERR_COMMON_FORBIDDEN_ACCOUNT.message, {
            remarks: 'User not active',
        });
    }
}
