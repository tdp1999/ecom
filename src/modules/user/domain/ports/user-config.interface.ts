import { UUID } from '@shared/types/general.type';

export interface IUserConfig {
    getDefaultPassword(): string;

    getSystemId(): UUID;
}
