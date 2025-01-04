import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermissionRpcRepository } from '@role/adapters/rpc/role-permission.rpc';
import { RoleRpcController } from '@role/adapters/rpc/role.rpc';
import { TransactionManager } from '@shared/decorators/transactional.decorator';
import { ClientModule } from '@shared/modules/client/client.module';
import { MODULE_IDENTIFIER } from '@shared/tokens/common.token';
import { RoleController } from './adapters/role.controller';
import { RoleEntity } from './adapters/role.entity';
import { RoleRepository } from './adapters/role.repository';
import { RoleService } from './domain/role.service';
import { ROLE_PERMISSION_REPOSITORY_TOKEN, ROLE_REPOSITORY_TOKEN, ROLE_SERVICE_TOKEN } from './domain/role.token';

@Module({
    controllers: [RoleController, RoleRpcController],
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
        {
            provide: ROLE_PERMISSION_REPOSITORY_TOKEN,
            useClass: RolePermissionRpcRepository,
        },
    ],
})
export class RoleModule {}
