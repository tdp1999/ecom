import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

export const CLIENT_PROXY = Symbol('CLIENT_PROXY');

@Module({})
export class ClientModule {
    static register(): DynamicModule {
        return ClientsModule.register([{ name: CLIENT_PROXY, options: { port: 3001 } }]);
    }
}
