import { AuthUserRpcRepository } from '@auth/adapters/rpc/auth-user.rpc';
import { AuthController } from '@auth/adapters/transport/auth.controller';
import { AuthService } from '@auth/domain/auth.service';
import { AUTH_SERVICE_TOKEN, AUTH_USER_REPOSITORY_TOKEN } from '@auth/domain/auth.token';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TransactionManager } from '@shared/decorators/transactional.decorator';
import { MODULE_IDENTIFIER } from '@shared/tokens/common.token';

@Module({
    controllers: [AuthController],
    imports: [ClientsModule.register([{ name: 'AUTH_PROXY', options: { port: 3001 } }])],
    providers: [
        TransactionManager,
        {
            provide: MODULE_IDENTIFIER,
            useValue: 'Auth',
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
