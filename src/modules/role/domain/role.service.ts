import { Inject, Injectable, Optional } from '@nestjs/common';
import { BaseCrudService } from '@shared/abstractions/service.base';
import { Role, RolePermissionSchema } from '@shared/models/role.model';
import { MODULE_IDENTIFIER } from '@shared/tokens/common.token';
import { Pagination } from '@shared/types/pagination.type';
import { IRolePermissionRepository, IRoleRepository } from './role-repository.interface';
import { IRoleService } from './role-service.interface';
import {
    RoleCreateDto,
    RoleCreateSchema,
    RoleSearchDto,
    RoleSearchSchema,
    RoleUpdateDto,
    RoleUpdateSchema,
} from './role.dto';
import { ROLE_PERMISSION_REPOSITORY_TOKEN, ROLE_REPOSITORY_TOKEN } from './role.token';

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
        @Inject(ROLE_PERMISSION_REPOSITORY_TOKEN) protected readonly permissionRepository: IRolePermissionRepository,
    ) {
        super(moduleName, repository);
    }

    override async list(query: RoleSearchDto): Promise<Role[]> {
        const { success, error, data } = this.searchSchema.safeParse(query);

        if (!success) throw this.handleValidationError(error);

        const roles = await this.repository.list(data);

        await this.loadRoleRelations(roles);

        return roles;
    }

    override async paginatedList(query?: RoleSearchDto): Promise<Pagination<Role>> {
        const { success, error, data } = this.searchSchema.safeParse(query);

        if (!success) throw this.handleValidationError(error);

        const result = await this.repository.paginatedList(data);

        await this.loadRoleRelations(result.items);

        return result;
    }

    override async get(id: string): Promise<Role | null> {
        const role = await this.getValidData(id);

        if (role.permissionIds) {
            /*
             * Consider: The code below demonstrate the problem of data synchronization in hexagonal architecture
             * await this.permissionRepository.loadByIds return (T | null)[]
             * but role.permissions only has the type T[]
             * That led to the scenario like this (got the question from ChatGPT):
             * Entity Product have an array of ids storing references to the Entity Category,
             * meaning product A can be in multiple categories 1, 2, 3.
             * Since I use microservices deploy each entity into a service,
             * I would have to call rpc from product to category service to get the result of the categories, if I need to aggregate data.
             * Categories can be deleted, deactivated and all kind of stuff like that. And since it is microservice,
             * I cannot do the cascade database technique to keep those data in sync.
             *
             * // role.permissions = await this.permissionRepository.loadByIds(role.permissionIds);
             * */

            // In this case, just ignore the difference between permissionIds and permissions

            const permissions = await this.permissionRepository.loadByIds(role.permissionIds);

            const parsedPermissions = permissions.map((permission) => {
                const { data, error } = RolePermissionSchema.safeParse(permission);

                if (error) {
                    console.warn('Failed to parse permission:', error);
                    return null;
                }

                return data;
            });

            role.permissions = parsedPermissions.filter((permission) => permission !== null);
        }

        return role;
    }

    protected async validateCreate(): Promise<void> {
        return Promise.resolve();
    }

    protected async validateUpdate(): Promise<void> {
        return Promise.resolve();
    }

    private async loadRoleRelations(roles: Role[]): Promise<void> {
        await Promise.all(
            roles.map(
                (role) =>
                    role.permissionIds.length &&
                    this.permissionRepository.loadByIds(role.permissionIds).then((permissions) => {
                        role.permissions = permissions.filter((permission) => permission !== null);
                    }),
            ),
        );
    }
}
