import { IJwtService } from '@auth/domain/auth-adapters.interface';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IJwtData, IJwtPayload } from '@shared/authenticate/authenticate.type';

export class JwtAdapter implements IJwtService {
    constructor(
        private readonly configService: ConfigService,
        @Inject(JwtService) private readonly jwtService: JwtService,
    ) {}

    generatePayload(iss: string, sub: string, email: string): IJwtPayload {
        return { iss, sub, email };
    }

    sign(payload: IJwtPayload): Promise<string> {
        return this.jwtService.signAsync(payload);
    }

    verify(token: string): Promise<IJwtData> {
        return this.jwtService.verifyAsync(token);
    }
}
