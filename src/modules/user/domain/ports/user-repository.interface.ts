import { IRepositoryCommand, IRepositoryQuery } from '@shared/interfaces/repository.interface';
import { UUID } from '@shared/types/general.type';
import { UserCreateDto, UserSearchDto, UserUpdateDto } from '../model/user.dto';
import { User, UserRole } from '../model/user.model';

export interface IUserRepositoryQuery extends IRepositoryQuery<User, UserSearchDto> {
    getPassword(userId: UUID): Promise<string>;
}

export interface IUserRepositoryCommand extends IRepositoryCommand<UserCreateDto, UserUpdateDto> {}

export interface IUserRepository extends IUserRepositoryQuery, IUserRepositoryCommand {}

export interface IUserRoleRepository {
    getById(id: UUID): Promise<UserRole | null>;
}
