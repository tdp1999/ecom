import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { AuthUserAction } from '@shared/actions/auth.action';
import { METADATA_PUBLIC } from '@shared/decorators/public.decorator';
import { USER_STATUS } from '@shared/enums/shared-user.enum';
import { ERR_COMMON_FORBIDDEN_ACCOUNT, ERR_COMMON_UNAUTHORIZED } from '@shared/errors/common-errors';
import { ForbiddenError, InternalServerError, UnauthorizedError } from '@shared/errors/domain-error';
import { CLIENT_PROXY } from '@shared/modules/client/client.module';
import { UserValidityResult } from '@shared/types/shared-user.type';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private reflector: Reflector,
        @Inject(CLIENT_PROXY) private readonly client: ClientProxy,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        // Check for public routes
        const isPublic = this.reflector.getAllAndOverride(METADATA_PUBLIC, [context.getHandler(), context.getClass()]);

        if (isPublic) return true;

        // Standard passport authentication
        const isTokenValid = await super.canActivate(context);

        if (!isTokenValid) return false;

        const request = context.switchToHttp().getRequest();
        const userId = request.user?.userId;

        if (!userId) throw InternalServerError('User id not found');

        // Check if user is valid
        const user = await lastValueFrom(this.client.send<Record<string, any>>(AuthUserAction.GET, userId));
        if (!user) throw UnauthorizedError(ERR_COMMON_UNAUTHORIZED.message);

        request.user = user;

        const result = await lastValueFrom(this.client.send<UserValidityResult>(AuthUserAction.VALIDATE, user));
        if (result.isValid) return true;
        if (result.status === USER_STATUS.DELETED) throw UnauthorizedError(ERR_COMMON_UNAUTHORIZED.message);
        throw ForbiddenError(result.invalidMessage || ERR_COMMON_FORBIDDEN_ACCOUNT.message);
    }

    handleRequest(err: any, user: any) {
        // Customize the 401 response
        if (err || !user) {
            throw UnauthorizedError(ERR_COMMON_UNAUTHORIZED.message);
        }

        return user;
    }
}
