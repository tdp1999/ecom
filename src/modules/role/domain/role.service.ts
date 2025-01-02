import { Inject, Injectable, Optional } from '@nestjs/common';
import { BaseCrudService } from '@shared/abstractions/service.base';
import { Role } from '@shared/models/role.model';
import { MODULE_IDENTIFIER } from '@shared/tokens/common.token';
import { IRoleRepository } from './role-repository.interface';
import { IRoleService } from './role-service.interface';
import {
    RoleCreateDto,
    RoleCreateSchema,
    RoleSearchDto,
    RoleSearchSchema,
    RoleUpdateDto,
    RoleUpdateSchema,
} from './role.dto';
import { ROLE_REPOSITORY_TOKEN } from './role.token';

@Injectable()
export class RoleService
    extends BaseCrudService<Role, RoleCreateDto, RoleUpdateDto, RoleSearchDto>
    implements IRoleService
{
    protected createSchema = RoleCreateSchema;
    protected updateSchema = RoleUpdateSchema;
    protected searchSchema = RoleSearchSchema;

    constructor(
        @Optional() @Inject(MODULE_IDENTIFIER) protected readonly moduleName: string = '',
        @Inject(ROLE_REPOSITORY_TOKEN) protected readonly repository: IRoleRepository,
    ) {
        super(moduleName, repository);
    }

    protected async validateCreate(): Promise<void> {
        return Promise.resolve();
    }

    protected async validateUpdate(): Promise<void> {
        return Promise.resolve();
    }
}
