import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { USER_STATUS } from '@shared/enums/shared-user.enum';
import { ISeed } from '@shared/seed/seed.interface';
import { hashPasswordByBcrypt } from '@shared/utils/hashing.util';
import { UserEntity } from '@user/adapters/repository/user.entity';
import { Repository } from 'typeorm';
import { v7 } from 'uuid';

@Injectable()
export class UserSeeder implements ISeed {
    constructor(
        @Inject(ConfigService) private readonly config: ConfigService,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    ) {}

    async seed(): Promise<void> {
        const email = this.config.get('general.defaultAdminEmail');
        const password = this.config.get('general.defaultAdminPassword');
        const systemId = this.config.get('general.defaultSystemId');

        const hashedPassword = await hashPasswordByBcrypt(password);

        const currentTimestamp = BigInt(Date.now());

        const user = this.userRepository.create({
            id: v7(),
            email,
            salt: '',
            password: hashedPassword,
            status: USER_STATUS.ACTIVE,
            isSystem: true,
            profile: {
                firstName: 'Root',
                lastName: 'User',
            },
            createdAt: currentTimestamp,
            createdById: systemId,
            updatedAt: currentTimestamp,
            updatedById: systemId,
        });
        await this.userRepository.save(user);
    }
}
