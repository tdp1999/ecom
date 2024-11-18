import { IService } from '@shared/interfaces/service.interface';
import { UserCreateDto, UserSearchDto, UserUpdateDto } from '../model/user.dto';
import { User } from '../model/user.model';

export interface IUserService extends IService<User, UserCreateDto, UserUpdateDto, UserSearchDto> {}
