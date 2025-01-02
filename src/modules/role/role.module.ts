import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionManager } from '@shared/decorators/transactional.decorator';
import { ClientModule } from '@shared/modules/client/client.module';
import { MODULE_IDENTIFIER } from '@shared/tokens/common.token';
import { RoleController } from './adapters/role.controller';
import { RoleEntity } from './adapters/role.entity';
import { RoleRepository } from './adapters/role.repository';
import { RoleService } from './domain/role.service';
import { ROLE_REPOSITORY_TOKEN, ROLE_SERVICE_TOKEN } from './domain/role.token';

@Module({
    controllers: [RoleController],
    imports: [TypeOrmModule.forFeature([RoleEntity]), ClientModule.registerAsync()],
    providers: [
        TransactionManager,
        {
            provide: MODULE_IDENTIFIER,
            useValue: 'Role',
        },
        {
            provide: ROLE_SERVICE_TOKEN,
            useClass: RoleService,
        },
        {
            provide: ROLE_REPOSITORY_TOKEN,
            useClass: RoleRepository,
        },
    ],
})
export class RoleModule {}
