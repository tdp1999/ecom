import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('restaurant')
export class RestaurantController {
    constructor(private readonly configService: ConfigService) {}

    @Get()
    findAll() {
        return this.configService.get('general').environment;
    }
}
