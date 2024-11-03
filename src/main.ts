import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { z } from 'zod';
import { globalErrorMap } from '@shared/errors/global-errors-map';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

z.setErrorMap(globalErrorMap);

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.TCP,
        options: {
            port: 3001,
        },
    });

    // Start all microservices and then listen on HTTP port
    await app.startAllMicroservices();

    await app.listen(3000);
}

bootstrap();
