import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { METADATA_AUTHORIZATION, METADATA_NO_AUTHORIZATION } from '@shared/authorize/authorize.token';
import {
    ERR_AUTHORIZE_USER_HAVE_NO_PERMISSION,
    ERR_AUTHORIZE_USER_HAVE_NO_ROLE,
    ERR_AUTHORIZE_USER_NOT_FOUND,
} from '@shared/errors/common-errors';
import { BadRequestError, ForbiddenError, InternalServerError } from '@shared/errors/domain-error';
import { Permission } from '@shared/models/permission.model';

@Injectable()
export class AuthorizeGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext) {
        if (this.isNonAuthorizedRoute(context)) {
            return true;
        }

        const requiredPermissions = this.getRequiredPermissions(context);
        if (!requiredPermissions.length) {
            return true;
        }

        const user = this.getRequestUser(context);
        this.validateUser(user);

        const userPermissions = new Set<string>(user.role.permissions.map((permission: Permission) => permission.slug));

        this.validateUserPermissions(requiredPermissions, userPermissions);

        return true;
    }

    private isNonAuthorizedRoute(context: ExecutionContext): boolean {
        return (
            this.reflector.getAllAndOverride(METADATA_NO_AUTHORIZATION, [context.getHandler(), context.getClass()]) ||
            false
        );
    }

    private getRequiredPermissions(context: ExecutionContext): string[] {
        const slugs = this.reflector.getAllAndMerge(METADATA_AUTHORIZATION, [context.getHandler(), context.getClass()]);

        if (!slugs || (Array.isArray(slugs) && slugs.length === 0)) {
            return [];
        }

        return typeof slugs === 'string' ? [slugs] : slugs;
    }

    private getRequestUser(context: ExecutionContext): any {
        const req =
            context.getType() === 'http' ? context.switchToHttp().getRequest() : context.switchToRpc().getContext();
        return req.user;
    }

    private validateUser(user: any): void {
        if (!user) throw InternalServerError(ERR_AUTHORIZE_USER_NOT_FOUND.message);

        if (!user.role) throw BadRequestError(ERR_AUTHORIZE_USER_HAVE_NO_ROLE.message);

        if (!user.role.permissions?.length) throw ForbiddenError(ERR_AUTHORIZE_USER_HAVE_NO_PERMISSION.message);
    }

    private validateUserPermissions(requiredPermissions: string[], userPermissions: Set<string>): void {
        for (const permission of requiredPermissions) {
            if (!userPermissions.has(permission)) {
                throw ForbiddenError(ERR_AUTHORIZE_USER_HAVE_NO_PERMISSION.message);
            }
        }
    }
}
