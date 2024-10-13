import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { z } from 'zod';
import { globalErrorMap } from '@shared/errors/global-errors-map';

z.setErrorMap(globalErrorMap);

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
}

bootstrap();
