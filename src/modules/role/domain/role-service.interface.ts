import { IService } from '@shared/interfaces/service.interface';
import { Role } from '@shared/models/role.model';
import { RoleCreateDto, RoleSearchDto, RoleUpdateDto } from './role.dto';

export interface IRoleService extends IService<Role, RoleCreateDto, RoleUpdateDto, RoleSearchDto> {}
