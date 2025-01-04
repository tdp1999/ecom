import { Inject, Injectable, Optional } from '@nestjs/common';
import { BaseCrudService } from '@shared/abstractions/service.base';
import { Permission } from '@shared/models/permission.model';
import { MODULE_IDENTIFIER } from '@shared/tokens/common.token';
import { IPermissionRepository } from './permission-repository.interface';
import { IPermissionService } from './permission-service.interface';
import {
    PermissionCreateDto,
    PermissionCreateSchema,
    PermissionSearchDto,
    PermissionSearchSchema,
    PermissionUpdateDto,
    PermissionUpdateSchema,
} from './permission.dto';
import { PERMISSION_REPOSITORY_TOKEN } from './permission.token';
import { UUID } from '@shared/types/general.type';

@Injectable()
export class PermissionService
    extends BaseCrudService<Permission, PermissionCreateDto, PermissionUpdateDto, PermissionSearchDto>
    implements IPermissionService
{
    protected createSchema = PermissionCreateSchema;
    protected updateSchema = PermissionUpdateSchema;
    protected searchSchema = PermissionSearchSchema;

    constructor(
        @Optional() @Inject(MODULE_IDENTIFIER) protected readonly moduleName: string = '',
        @Inject(PERMISSION_REPOSITORY_TOKEN) protected readonly repository: IPermissionRepository,
    ) {
        super(moduleName, repository);
    }

    getByIds(ids: UUID[]): Promise<Permission[]> {
        return this.repository.findByIds(ids);
    }

    protected async validateCreate(): Promise<void> {
        return Promise.resolve();
    }

    protected async validateUpdate(): Promise<void> {
        return Promise.resolve();
    }
}
