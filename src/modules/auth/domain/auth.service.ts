import { IJwtService } from '@auth/domain/auth-adapters.interface';
import { IAuthUserRepository } from '@auth/domain/auth-repository.interface';
import {
    ERR_AUTH_STILL_LOGGED_IN,
    ERR_AUTH_USER_NOT_FOUND,
    ERR_AUTH_USER_PASSWORD_INVALID,
    ERR_AUTH_USER_PENDING,
} from '@auth/domain/auth.error';
import { AUTH_JWT_SERVICE_TOKEN, AUTH_USER_REPOSITORY_TOKEN } from '@auth/domain/auth.token';
import { Inject, Injectable } from '@nestjs/common';
import { IJwtData } from '@shared/authenticate/authenticate.type';
import { USER_STATUS } from '@shared/enums/shared-user.enum';
import { ERR_COMMON_FORBIDDEN_ACCOUNT, ERR_COMMON_UNAUTHORIZED } from '@shared/errors/common-errors';
import { BadRequestError, ForbiddenError, UnauthorizedError } from '@shared/errors/domain-error';
import { formatZodError } from '@shared/errors/error-formatter';
import { UUID } from '@shared/types/general.type';
import { SharedUser } from '@shared/types/user.shared.type';
import { comparePasswordByBcrypt, hashPasswordByBcrypt } from '@shared/utils/hashing.util';
import { IAuthService, ILoginResponse } from './auth-service.interface';
import { AuthChangePasswordDto, AuthLoginDto, AuthLoginSchema, AuthRegisterDto, AuthRegisterSchema } from './auth.dto';

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        @Inject(AUTH_JWT_SERVICE_TOKEN) private readonly jwtService: IJwtService,
        @Inject(AUTH_USER_REPOSITORY_TOKEN) private readonly userRepository: IAuthUserRepository,
    ) {}

    async register(credentials: AuthRegisterDto, user?: SharedUser): Promise<boolean> {
        if (user) throw BadRequestError(ERR_AUTH_STILL_LOGGED_IN.message);

        const { success, error, data } = AuthLoginSchema.safeParse(credentials);

        if (!success) throw BadRequestError(formatZodError(error));

        const { password } = data;

        const hashedPassword = await hashPasswordByBcrypt(password);

        await this.userRepository.create({ ...data, password: hashedPassword });

        return true;
    }

    async login(credentials: AuthLoginDto, user?: SharedUser): Promise<ILoginResponse> {
        if (user) throw BadRequestError(ERR_AUTH_STILL_LOGGED_IN.message);

        const { success, error, data } = AuthRegisterSchema.safeParse(credentials);

        if (!success) throw BadRequestError(formatZodError(error));

        const { email, password } = data;

        const existUser = await this.userRepository.getByEmail(email);

        if (!existUser) {
            throw BadRequestError(ERR_AUTH_USER_NOT_FOUND.message);
        }

        const hashedPassword = await this.userRepository.getPassword(existUser.id);
        const isPasswordValid = await comparePasswordByBcrypt(password, hashedPassword);

        if (!isPasswordValid) {
            throw BadRequestError(ERR_AUTH_USER_PASSWORD_INVALID.message);
        }

        const userValidity = await this.userRepository.getUserValidity(existUser);

        if (!userValidity.isValid) {
            switch (userValidity.status) {
                case USER_STATUS.DELETED:
                    throw UnauthorizedError(ERR_COMMON_UNAUTHORIZED.message);
                case USER_STATUS.PENDING:
                    throw ForbiddenError(ERR_AUTH_USER_PENDING.message);
                default:
                    throw ForbiddenError(userValidity.invalidMessage || ERR_COMMON_FORBIDDEN_ACCOUNT.message);
            }
        }

        // Token will be expired in 1h
        const tokenPayload = this.jwtService.generatePayload('E-com', existUser.id, existUser.email);

        return { accessToken: await this.jwtService.sign(tokenPayload) };
    }

    async changePassword(userId: UUID, payload: AuthChangePasswordDto): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    async verify(token: string): Promise<IJwtData> {
        return this.jwtService.verify(token);
    }
}
