import { IService } from '@shared/interfaces/service.interface';
import { Email, UUID } from '@shared/types/general.type';
import { UserValidityResult } from '@shared/types/shared-user.type';
import { UserCreateDto, UserSearchDto, UserUpdateDto } from '../model/user.dto';
import { User } from '../model/user.model';

export interface IUserService extends IService<User, UserCreateDto, UserUpdateDto, UserSearchDto> {
    create(payload: UserCreateDto, hashedPassword?: string): Promise<UUID>;

    findByEmail(email: Email): Promise<User | null>;

    getPassword(userId: UUID): Promise<string>;

    getUserValidity(user: User): Promise<UserValidityResult>;
}
