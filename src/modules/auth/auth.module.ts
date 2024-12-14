import { AuthUserRpcRepository } from '@auth/adapters/auth-user.rpc';
import { AuthController } from '@auth/adapters/auth.controller';
import { AuthRpcController } from '@auth/adapters/auth.rpc';
import { JwtAdapter } from '@auth/adapters/jwt.adapter';
import { AuthService } from '@auth/domain/auth.service';
import { AUTH_JWT_SERVICE_TOKEN, AUTH_SERVICE_TOKEN, AUTH_USER_REPOSITORY_TOKEN } from '@auth/domain/auth.token';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TransactionManager } from '@shared/decorators/transactional.decorator';
import { ClientModule } from '@shared/modules/client/client.module';
import { MODULE_IDENTIFIER } from '@shared/tokens/common.token';

@Module({
    controllers: [AuthController, AuthRpcController],
    imports: [
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
