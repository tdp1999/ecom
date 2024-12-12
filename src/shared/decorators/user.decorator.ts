import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.getType() === 'http' ? ctx.switchToHttp().getRequest() : ctx.switchToRpc().getContext();
    return request.user;
});
