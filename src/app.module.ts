import { AuthModule } from '@auth/auth.module';
import { BrandModule } from '@brand/brand.module';
import { CategoryModule } from '@category/category.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from '@product/product.module';
import databaseConfig from '@shared/configs/database.config';
import generalConfig from '@shared/configs/general.config';
import { GlobalExceptionFilter } from '@shared/filters/global-exception.filter';
import { AuthGuard } from '@shared/auth/auth.guard';
import { TransformInterceptor } from '@shared/interceptors/transform.interceptor';
import { ClientModule } from '@shared/modules/client/client.module';
import { UserModule } from '@user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const modules = [CategoryModule, BrandModule, ProductModule, UserModule, AuthModule];

@Module({
    imports: [
        ClientModule.register(),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseConfig, generalConfig],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const config = configService.get('database');
                const environment = configService.get('general').environment || 'local';

                if (!config) {
                    throw new Error('Database configuration not found');
                }

                return {
                    ...config,
                    logging: environment === 'local',
                };
            },
        }),
        ...modules,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            // For success response
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },
        {
            // For error response
            provide: APP_FILTER,
            useClass: GlobalExceptionFilter,
        },
        {
            // For global authentication
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class AppModule {}
