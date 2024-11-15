import { IRepositoryCommand, IRepositoryQuery } from '@shared/interfaces/repository.interface';
import { UserCreateDto, UserSearchDto, UserUpdateDto } from '../model/user.dto';
import { User } from '../model/user.model';

export interface IUserRepositoryQuery extends IRepositoryQuery<User, UserSearchDto> {}

export interface IUserRepositoryCommand extends IRepositoryCommand<UserCreateDto, UserUpdateDto> {}

export interface IUserRepository extends IUserRepositoryQuery, IUserRepositoryCommand {}
