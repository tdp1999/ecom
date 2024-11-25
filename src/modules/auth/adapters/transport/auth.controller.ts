import { IAuthService } from '@auth/domain/auth-service.interface';
import { AuthLoginDto, AuthRegisterDto } from '@auth/domain/auth.dto';
import { AUTH_SERVICE_TOKEN } from '@auth/domain/auth.token';
import { Body, Controller, Inject, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(@Inject(AUTH_SERVICE_TOKEN) private readonly service: IAuthService) {}

    @Post('register')
    async register(@Body() data: AuthRegisterDto) {
        return this.service.register(data);
    }

    @Post('login')
    async login(@Body() credentials: AuthLoginDto) {
        return this.service.login(credentials);
    }

    // @UseGuards(JwtAuthGuard)
    // @Patch('change-password')
    // async changePassword(@Request() req, @Body() payload: ChangePasswordDto) {
    //     return this.authService.changePassword(req.user.userId, payload);
    // }
}
