import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './adapters/repository/user.entity';
import { UserProfileEntity } from './adapters/repository/user-profile.entity';
import { TransactionManager } from '@shared/decorators/transactional.decorator';
import { MODULE_IDENTIFIER } from '@shared/tokens/common.token';
import { USER_REPOSITORY_TOKEN, USER_SERVICE_TOKEN } from './domain/model/user.token';
import { UserService } from './domain/service/user.service';
import { UserRepository } from './adapters/repository/user.repository';
import { UserController } from './adapters/transport/user.controller';
import { ConfigService } from '@nestjs/config';
import { IUserRepository } from './domain/ports/user-repository.interface';
import { UserConfigAdapter } from './adapters/user-config.adapter';

@Module({
    controllers: [UserController],
    imports: [TypeOrmModule.forFeature([UserEntity, UserProfileEntity])],
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
            provide: USER_SERVICE_TOKEN,
            useFactory: (config: ConfigService, moduleName: string, repository: IUserRepository) => {
                const userConfig = new UserConfigAdapter(config);
                return new UserService(userConfig, repository, moduleName);
            },
            inject: [ConfigService, MODULE_IDENTIFIER, USER_REPOSITORY_TOKEN],
        },
    ],
})
export class UserModule {}
