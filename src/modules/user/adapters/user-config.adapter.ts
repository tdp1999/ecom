import { ConfigService } from '@nestjs/config';
import { IUserConfig } from '../domain/ports/user-config.interface';

export class UserConfigAdapter implements IUserConfig {
    constructor(private configService: ConfigService) {}

    getDefaultPassword(): string {
        return this.configService.get('general').defaultPassword;
    }
}
