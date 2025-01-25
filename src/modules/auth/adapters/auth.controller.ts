import { IAuthService } from '@auth/domain/auth-service.interface';
import { AuthLoginDto, AuthRegisterDto, AuthUser } from '@auth/domain/auth.dto';
import { AUTH_SERVICE_TOKEN } from '@auth/domain/auth.token';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { RequireNoAuth } from '@shared/decorators/public.decorator';
import { User } from '@shared/decorators/user.decorator';

@Controller('auth')
export class AuthController {
    constructor(@Inject(AUTH_SERVICE_TOKEN) private readonly service: IAuthService) {}

    @RequireNoAuth()
    @Post('register')
    async register(@Body() data: AuthRegisterDto) {
        return this.service.register(data);
    }

    @RequireNoAuth()
    @Post('login')
    async login(@Body() credentials: AuthLoginDto) {
        return this.service.login(credentials);
    }

    @Get('me')
    me(@User() user: AuthUser) {
        return user;
    }
}
