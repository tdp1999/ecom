import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { z } from 'zod';
import { globalErrorMap } from '@shared/errors/global-errors-map';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

z.setErrorMap(globalErrorMap);

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['log', 'error'],
    });

    const configService = app.get(ConfigService);

    app.setGlobalPrefix(process.env.GLOBAL_PREFIX || 'api');

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.TCP,
        options: {
            host: configService.get<string>('general.transportHost'),
            port: Number(configService.get<number>('general.transportPort')),
        },
    });

    // Start all microservices and then listen on HTTP port
    await app.startAllMicroservices();

    await app.listen(process.env.PORT || 3000);
}

bootstrap();
