import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { AuthUserAction } from '@shared/auth/auth.action';
import { USER_ROLE, USER_STATUS } from '@shared/enums/shared-user.enum';
import { CLIENT_PROXY } from '@shared/modules/client/client.module';
import { ISeed } from '@shared/seed/seed.interface';
import { hashPasswordByBcrypt } from '@shared/utils/hashing.util';
import { lastValueFrom } from 'rxjs';

export class UserSeeder implements ISeed {
    constructor(
        @Inject(CLIENT_PROXY) private readonly client: ClientProxy,
        @Inject(ConfigService) private readonly config: ConfigService,
    ) {}

    async seed(): Promise<void> {
        const password = this.config.get('general.defaultAdminPassword');
        const hashedPassword = await hashPasswordByBcrypt(password);

        const rootUser = {
            email: this.config.get('general.defaultAdminEmail'),
            password: hashedPassword,
            // Todo: remove those magic strings, use enum instead
            status: USER_STATUS.ACTIVE,
            role: USER_ROLE.ROOT_ADMIN,
            profile: {
                firstName: 'Root',
                lastName: 'User',
            },
        };

        return lastValueFrom(this.client.send(AuthUserAction.CREATE, rootUser));
    }
}
