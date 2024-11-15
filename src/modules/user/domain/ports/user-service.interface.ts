import { IService } from '@shared/interfaces/service.interface';
import { User } from '../model/user.model';
import { UserCreateDto, UserLoginDto, UserRegisterDto, UserSearchDto, UserUpdateDto } from '../model/user.dto';

export interface IUserService extends IService<User, UserCreateDto, UserUpdateDto, UserSearchDto> {
    verifyToken(token: string): Promise<any>;

    login(payload: UserLoginDto): Promise<string>;

    register(payload: UserRegisterDto): Promise<string>;
}
