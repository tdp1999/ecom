import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionManager } from '@shared/decorators/transactional.decorator';
import { ClientModule } from '@shared/modules/client/client.module';
import { MODULE_IDENTIFIER } from '@shared/tokens/common.token';
import { PermissionController } from './adapters/permission.controller';
import { PermissionEntity } from './adapters/permission.entity';
import { PermissionRepository } from './adapters/permission.repository';
import { PermissionService } from './domain/permission.service';
import { PERMISSION_REPOSITORY_TOKEN, PERMISSION_SERVICE_TOKEN } from './domain/permission.token';

@Module({
    controllers: [PermissionController],
    imports: [TypeOrmModule.forFeature([PermissionEntity]), ClientModule.registerAsync()],
    providers: [
        TransactionManager,
        {
            provide: MODULE_IDENTIFIER,
            useValue: 'Permission',
        },
        {
            provide: PERMISSION_SERVICE_TOKEN,
            useClass: PermissionService,
        },
        {
            provide: PERMISSION_REPOSITORY_TOKEN,
            useClass: PermissionRepository,
        },
    ],
})
export class PermissionModule {}
