import { IAuthService } from '@auth/domain/auth-service.interface';
import { AUTH_SERVICE_TOKEN } from '@auth/domain/auth.token';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(@Inject(AUTH_SERVICE_TOKEN) private readonly authService: IAuthService) {
        super({ usernameField: 'email' });
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.login({ email, password });
        if (!user) throw new UnauthorizedException();
        return user;
    }
}
