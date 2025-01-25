import { ConfigService } from '@nestjs/config';
import { IUserConfig } from '../domain/ports/user-config.interface';
import { UUID } from '@shared/types/general.type';

export class UserConfigAdapter implements IUserConfig {
    constructor(private configService: ConfigService) {}

    getDefaultPassword(): string {
        return this.configService.get('general').defaultPassword;
    }

    getSystemId(): UUID {
        return this.configService.get('general').defaultSystemId;
    }
}
