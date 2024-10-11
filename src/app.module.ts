import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from '@shared/configs/database.config';
import generalConfig from '@shared/configs/general.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantModule } from './modules/restaurant/restaurant.module';

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
                const environment =
                    configService.get('general').environment || 'local';

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
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
