import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { METADATA_AUTHORIZATION, METADATA_NO_AUTHORIZATION } from '@shared/authorize/authorize.token';
import { InternalServerError } from '@shared/errors/domain-error';

@Injectable()
export class AuthorizeGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext) {
        // Check for non-authorized routes. Metadata can be set on controller class or method
        const isNonAuthorized = this.reflector.getAllAndOverride(METADATA_NO_AUTHORIZATION, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isNonAuthorized) return true;

        const req =
            context.getType() === 'http' ? context.switchToHttp().getRequest() : context.switchToRpc().getContext();
        const user = req.user;

        if (!user) throw InternalServerError('User not found during authorization process.');

        // Check for all permissions in metadata
        const slugs = this.reflector.getAllAndMerge(METADATA_AUTHORIZATION, [context.getHandler(), context.getClass()]);
        // const isDoublePermission = Array.isArray(slugs);

        console.log('Slugs: ', slugs);

        // Check if user has permission
        // if (slugs) {
        //     const hasPermission = slugs.some((slug) => user.permissions.includes(slug));
        //     if (!hasPermission) throw InternalServerError('User does not have permission.');
        // }

        return true;
    }
}
