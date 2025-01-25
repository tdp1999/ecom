import { IService } from '@shared/interfaces/service.interface';
import { Email, UUID } from '@shared/types/general.type';
import { SharedUser, UserValidityResult } from '@shared/types/user.shared.type';
import { UserCreateDto, UserSearchDto, UserUpdateDto } from '../model/user.dto';
import { User } from '../model/user.model';

export interface IUserService extends Omit<IService<User, UserCreateDto, UserUpdateDto, UserSearchDto>, 'create'> {
    create(payload: UserCreateDto, user?: SharedUser, hashedPassword?: string): Promise<UUID>;

    findByEmail(email: Email): Promise<User | null>;

    getPassword(userId: UUID): Promise<string>;

    getUserValidity(user: User): Promise<UserValidityResult>;

    activate(userId: UUID): Promise<boolean>;
}
