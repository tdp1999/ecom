import { Module } from '@nestjs/common';
import { RestaurantController } from './adapters/transport/restaurant.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
    controllers: [RestaurantController],
    imports: [ConfigModule],
})
export class RestaurantModule {}
