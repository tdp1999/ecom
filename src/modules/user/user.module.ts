import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionManager } from '@shared/decorators/transactional.decorator';
import { ClientModule } from '@shared/modules/client/client.module';
import { MODULE_IDENTIFIER } from '@shared/tokens/common.token';
import { UserRoleRpcRepository } from '@user/adapters/rpc/user-role.rpc';
import { UserRpcController } from '@user/adapters/rpc/user.rpc';
import { UserProfileEntity } from './adapters/repository/user-profile.entity';
import { UserEntity } from './adapters/repository/user.entity';
import { UserRepository } from './adapters/repository/user.repository';
import { UserController } from './adapters/transport/user.controller';
import { UserConfigAdapter } from './adapters/user-config.adapter';
import { USER_REPOSITORY_TOKEN, USER_ROLE_REPOSITORY_TOKEN, USER_SERVICE_TOKEN } from './domain/model/user.token';
import { IUserRepository, IUserRoleRepository } from './domain/ports/user-repository.interface';
import { UserService } from './domain/service/user.service';

@Module({
    controllers: [UserController, UserRpcController],
    imports: [TypeOrmModule.forFeature([UserEntity, UserProfileEntity]), ClientModule.registerAsync()],
    providers: [
        TransactionManager,
        {
            provide: USER_REPOSITORY_TOKEN,
            useClass: UserRepository,
        },
        {
            provide: MODULE_IDENTIFIER,
            useValue: 'Users',
        },
        {
            provide: USER_ROLE_REPOSITORY_TOKEN,
            useClass: UserRoleRpcRepository,
        },
        {
            provide: USER_SERVICE_TOKEN,
            useFactory: (
                config: ConfigService,
                moduleName: string,
                repository: IUserRepository,
                roleRepository: IUserRoleRepository,
            ) => {
                const userConfig = new UserConfigAdapter(config);
                return new UserService(userConfig, repository, moduleName, roleRepository);
            },
            inject: [ConfigService, MODULE_IDENTIFIER, USER_REPOSITORY_TOKEN, USER_ROLE_REPOSITORY_TOKEN],
        },
    ],
})
export class UserModule {}
