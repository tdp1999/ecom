import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from './adapters/repository/restaurant.entity';
import { RestaurantRepository } from './adapters/repository/restaurant.repository';
import { RestaurantController } from './adapters/transport/restaurant.controller';
import { RESTAURANT_SERVICE_TOKEN } from './domain/ports/inbound/restaurant-inbound.interface';
import { RESTAURANT_REPOSITORY_TOKEN } from './domain/ports/outbound/restaurant-outbound.interface';
import { RestaurantService } from './domain/services/restaurant.service';

@Module({
    controllers: [RestaurantController],
    imports: [ConfigModule, TypeOrmModule.forFeature([RestaurantEntity])],
    providers: [
        {
            provide: RESTAURANT_SERVICE_TOKEN,
            useClass: RestaurantService,
        },
        {
            provide: RESTAURANT_REPOSITORY_TOKEN,
            useClass: RestaurantRepository,
        },
    ],
})
export class RestaurantModule {}
