import { CategoryModule } from '@category/category.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantModule } from '@restaurant/restaurant.module';
import databaseConfig from '@shared/configs/database.config';
import generalConfig from '@shared/configs/general.config';
import { GlobalExceptionFilter } from '@shared/filters/global-exception.filter';
import { TransformInterceptor } from '@shared/interceptors/transform.interceptor';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
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
        RestaurantModule,
        CategoryModule,
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
    ],
})
export class AppModule {}
