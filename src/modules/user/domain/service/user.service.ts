import { Inject, Injectable, Optional } from '@nestjs/common';
import { USER_STATUS } from '@shared/enums/shared-user.enum';
import { BadRequestError, NotFoundError } from '@shared/errors/domain-error';
import { formatZodError } from '@shared/errors/error-formatter';
import { MODULE_IDENTIFIER } from '@shared/tokens/common.token';
import { Email, UUID } from '@shared/types/general.type';
import { Pagination } from '@shared/types/pagination.type';
import { SharedUser, UserValidityResult } from '@shared/types/user.shared.type';
import { hashPasswordByBcrypt } from '@shared/utils/hashing.util';
import { v7 } from 'uuid';
import { ZodError } from 'zod';
import {
    UserCreateDto,
    UserCreateSchema,
    UserSearchDto,
    UserSearchSchema,
    UserUpdateDto,
    UserUpdateSchema,
} from '../model/user.dto';
import { ERR_USER_ALREADY_ACTIVE, ERR_USER_EMAIL_EXISTS, ERR_USER_UNABLE_TO_ACTIVATE } from '../model/user.error';
import { User } from '../model/user.model';
import { USER_CONFIG_TOKEN, USER_REPOSITORY_TOKEN, USER_ROLE_REPOSITORY_TOKEN } from '../model/user.token';
import { IUserConfig } from '../ports/user-config.interface';
import { IUserRepository, IUserRoleRepository } from '../ports/user-repository.interface';
import { IUserService } from '../ports/user-service.interface';

@Injectable()
export class UserService implements IUserService {
    private readonly visibleColumns: (keyof User)[] = ['id', 'status', 'email', 'createdById'];

    constructor(
        @Inject(USER_CONFIG_TOKEN) private config: IUserConfig,
        @Inject(USER_REPOSITORY_TOKEN) protected readonly repository: IUserRepository,
        @Optional() @Inject(MODULE_IDENTIFIER) protected readonly moduleName: string = '',
        @Inject(USER_ROLE_REPOSITORY_TOKEN) protected readonly roleRepository: IUserRoleRepository,
    ) {}

    public async list(query?: UserSearchDto): Promise<User[]> {
        const { success, error, data } = UserSearchSchema.safeParse(query);

        if (!success) {
            throw BadRequestError(formatZodError(error));
        }

        return this.repository.list(data, this.visibleColumns);
    }

    public async paginatedList(query?: UserSearchDto): Promise<Pagination<User>> {
        const { success, error, data } = UserSearchSchema.safeParse(query);

        if (!success) throw this.handleValidationError(error);

        return this.repository.paginatedList(data, this.visibleColumns);
    }

    public async exist(id: UUID): Promise<boolean> {
        return this.repository.exist(id);
    }

    public async existAndValid(id: UUID): Promise<boolean> {
        return this.repository.existAndNotDeleted(id);
    }

    public async findByEmail(email: Email): Promise<User | null> {
        if (!this.repository.findByConditions) throw new Error('Method repository.findByConditions not implemented.');
        return await this.repository.findByConditions({ email }, this.visibleColumns);
    }

    public async getPassword(userId: UUID): Promise<string> {
        return await this.repository.getPassword(userId);
    }

    public async get(id: string, visibleColumns?: (keyof User)[]): Promise<User | null> {
        const user = await this.getValidData(id, visibleColumns);

        if (user.roleId) {
            const role = await this.roleRepository.getById(user.roleId);
            if (role) user.role = role;
        }

        return user;
    }

    public async getValidData(id: UUID, visibleColumns?: (keyof User)[]): Promise<User> {
        // Allow to pass [] to get all columns
        const visibleColumnsToUse = visibleColumns ?? this.visibleColumns;
        const data = await this.repository.findById(id, visibleColumnsToUse);

        if (!data || !!data.deletedAt) {
            throw NotFoundError(`${this.moduleName} with id ${id} not found`);
        }

        return data;
    }

    public async getUserValidity(user: User): Promise<UserValidityResult> {
        if (user.deletedAt) return { isValid: false, status: USER_STATUS.DELETED };

        if (user.status !== USER_STATUS.ACTIVE) return { isValid: false, status: user.status };

        return { isValid: true, status: USER_STATUS.ACTIVE };
    }

    public async activate(userId: UUID): Promise<boolean> {
        const user = await this.getValidData(userId);
        if (user.status === 'active') throw BadRequestError(ERR_USER_ALREADY_ACTIVE.message);
        if (user.status !== 'pending') throw BadRequestError(ERR_USER_UNABLE_TO_ACTIVATE.message);
        return this.repository.update(userId, { status: USER_STATUS.ACTIVE });
    }

    public async create(payload: UserCreateDto, user?: SharedUser, hashedPassword?: string): Promise<UUID> {
        const { success, error, data } = UserCreateSchema.safeParse(payload);

        if (!success) {
            throw this.handleValidationError(error);
        }

        // Check if email already exists
        await this.validateCreate(payload);

        // Inside this function, we allow user to pass in credentials (in case of external registration)
        // Or credentials will be auto-generated by the service
        if (!hashedPassword) {
            hashedPassword = await hashPasswordByBcrypt(this.config.getDefaultPassword());
        }

        const id = v7();
        const currentTimestamp = BigInt(Date.now());
        const initUserId = user?.id ?? this.config.getSystemId();

        const entity: User = {
            id,
            ...data,
            password: hashedPassword,
            salt: '',
            createdAt: currentTimestamp,
            createdById: initUserId,
            updatedAt: currentTimestamp,
            updatedById: initUserId,
        };

        await this.repository.create(entity);

        return id;
    }

    public async update(user: SharedUser, id: string, payload: UserUpdateDto): Promise<boolean> {
        const { success, error, data } = UserUpdateSchema.safeParse(payload);

        if (!success) {
            throw this.handleValidationError(error);
        }

        const isExisted = await this.repository.exist(id);
        if (!isExisted) {
            throw NotFoundError(`${this.moduleName} with id ${id} not found`);
        }

        // await this.validateUpdate(id, data);

        return this.repository.update(id, { ...data, updatedById: user.id } as User);
    }

    public async delete(user: SharedUser, id: string, isHardDelete?: boolean): Promise<boolean> {
        const isExisted = await this.repository.exist(id);

        if (!isExisted) {
            throw NotFoundError(`${this.moduleName} with id ${id} not found`);
        }

        // if (user.id === id) {
        //     throw BadRequestError('Cannot delete your own account');
        // }

        if (isHardDelete) {
            return this.repository.delete(id);
        }

        return this.repository.update(id, { deletedAt: BigInt(Date.now()), deletedById: user.id });
    }

    // Validate method
    private async validateCreate(data: UserCreateDto): Promise<void> {
        const isEmailExist = await this.checkIfEmailExist(data.email);

        if (isEmailExist) {
            throw BadRequestError(ERR_USER_EMAIL_EXISTS.message);
        }
    }

    private async validateUpdate(): Promise<void> {
        return await Promise.resolve();
    }

    // Helper methods
    private async checkIfEmailExist(email: Email): Promise<boolean> {
        if (!this.repository.findByConditions) throw new Error('Method repository.findByConditions not implemented.');
        return !!(await this.repository.findByConditions({ email }));
    }

    private handleValidationError(error: ZodError) {
        return BadRequestError(formatZodError(error));
    }
}
