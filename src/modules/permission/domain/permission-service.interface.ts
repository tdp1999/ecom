import { IService } from '@shared/interfaces/service.interface';
import { Permission } from '@shared/models/permission.model';
import { UUID } from '@shared/types/general.type';
import { PermissionCreateDto, PermissionSearchDto, PermissionUpdateDto } from './permission.dto';

export interface IPermissionService
    extends IService<Permission, PermissionCreateDto, PermissionUpdateDto, PermissionSearchDto> {
    getByIds(ids: UUID[]): Promise<Permission[]>;
}
