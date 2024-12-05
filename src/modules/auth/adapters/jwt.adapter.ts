import { IJwtPayload, IJwtService } from '@auth/domain/auth-adapters.interface';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export class JwtAdapter implements IJwtService {
    constructor(
        private readonly configService: ConfigService,
        @Inject(JwtService) private readonly jwtService: JwtService,
    ) {}

    generatePayload(iss: string, sub: string, email: string): IJwtPayload {
        // const iat = TemporalValue.getNow();
        // const duration = this.configService.get<number>('JWT_DURATION');
        // const exp = TemporalValue.addMillis(iat, );

        return { iss, sub, email };
    }

    sign(payload: IJwtPayload): Promise<string> {
        return this.jwtService.signAsync(payload);
    }

    verify(token: string): Promise<IJwtPayload> {
        return this.jwtService.verifyAsync(token);
    }
}
