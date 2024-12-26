import { IRepositoryCommand, IRepositoryQuery } from '@shared/interfaces/repository.interface';
import { Permission } from '@shared/models/permission.model';
import { PermissionCreateDto, PermissionSearchDto, PermissionUpdateDto } from './permission.dto';

export interface IPermissionRepositoryQuery extends IRepositoryQuery<Permission, PermissionSearchDto> {}

export interface IPermissionRepositoryCommand extends IRepositoryCommand<PermissionCreateDto, PermissionUpdateDto> {}

export interface IPermissionRepository extends IPermissionRepositoryQuery, IPermissionRepositoryCommand {}
