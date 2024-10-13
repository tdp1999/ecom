import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    ImATeapotException,
    Inject,
    InternalServerErrorException,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { DomainError } from '@shared/errors/domain-error';
import { RestaurantCreateDto, RestaurantSearchDto, RestaurantUpdateDto } from '../../domain/model/restaurant.dto';
import { IRestaurantService, RESTAURANT_SERVICE_TOKEN } from '../../domain/ports/inbound/restaurant-inbound.interface';

@Controller('restaurant')
export class RestaurantController {
    constructor(@Inject(RESTAURANT_SERVICE_TOKEN) private readonly service: IRestaurantService) {}

    @Post()
    async create(@Body() payload: RestaurantCreateDto) {
        try {
            return await this.service.create(payload);
        } catch (error) {
            if (error instanceof DomainError) {
                throw new BadRequestException({ ...error });
            }

            throw new ImATeapotException();
        }
    }

    @Get()
    list(@Query() query?: RestaurantSearchDto) {
        return this.service.list(query);
    }

    @Get(':id')
    get(@Param('id') id: string) {
        return this.service.get(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() payload: RestaurantUpdateDto) {
        return this.service.update(id, payload);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.service.delete(id);
    }
}
