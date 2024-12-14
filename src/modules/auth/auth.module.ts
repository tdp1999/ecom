import { JwtAdapter } from '@auth/adapters/jwt.adapter';
import { AuthUserRpcRepository } from '@auth/adapters/rpc/auth-user.rpc';
import { JwtStrategy } from '@auth/adapters/strategy/jwt.strategy';
import { LocalStrategy } from '@auth/adapters/strategy/local.strategy';
import { AuthController } from '@auth/adapters/transport/auth.controller';
import { AuthService } from '@auth/domain/auth.service';
import { AUTH_JWT_SERVICE_TOKEN, AUTH_SERVICE_TOKEN, AUTH_USER_REPOSITORY_TOKEN } from '@auth/domain/auth.token';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TransactionManager } from '@shared/decorators/transactional.decorator';
import { ClientModule } from '@shared/modules/client/client.module';
import { MODULE_IDENTIFIER } from '@shared/tokens/common.token';

@Module({
    controllers: [AuthController],
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('general.jwtSecret') || 'your-secret-key',
                signOptions: { expiresIn: configService.get('general.jwtExpirationTime') || '1d' },
            }),
            inject: [ConfigService],
        }),
        ClientModule.register(),
    ],
    providers: [
        TransactionManager,
        LocalStrategy,
        JwtStrategy,
        {
            provide: MODULE_IDENTIFIER,
            useValue: 'Auth',
        },
        {
            provide: AUTH_JWT_SERVICE_TOKEN,
            useClass: JwtAdapter,
        },
        {
            provide: AUTH_USER_REPOSITORY_TOKEN,
            useClass: AuthUserRpcRepository,
        },
        {
            provide: AUTH_SERVICE_TOKEN,
            useClass: AuthService,
        },
    ],
})
export class AuthModule {}
