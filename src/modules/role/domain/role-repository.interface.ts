import { IRepositoryCommand, IRepositoryQuery } from '@shared/interfaces/repository.interface';
import { Role, RolePermission } from '@shared/models/role.model';
import { UUID } from '@shared/types/general.type';
import { RoleCreateDto, RoleSearchDto, RoleUpdateDto } from './role.dto';

export interface IRoleRepositoryQuery extends IRepositoryQuery<Omit<Role, 'permissions'>, RoleSearchDto> {}

export interface IRoleRepositoryCommand extends IRepositoryCommand<RoleCreateDto, RoleUpdateDto> {}

export interface IRoleRepository extends IRoleRepositoryQuery, IRoleRepositoryCommand {}

export interface IRolePermissionRepository {
    // get(id: UUID): Promise<RolePermission | null>;

    load(id: UUID): Promise<RolePermission | null>;

    getByIds(ids: UUID[]): Promise<(RolePermission | null)[]>;
}
