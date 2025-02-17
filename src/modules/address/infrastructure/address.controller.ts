import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { User } from '@shared/decorators/user.decorator';
import { UUID } from '@shared/types/general.type';
import { SharedUser } from '@shared/types/user.shared.type';
import { ADDRESS_SERVICE_TOKEN } from '../application/address.token';
import { AddressCreateCommandDto, AddressQueryDto, AddressUpdateCommandDto } from '../application/dtos/address.dto';
import { IAddressService } from '../application/ports/address-service.in.port';

@Controller('address')
export class AddressController {
    constructor(@Inject(ADDRESS_SERVICE_TOKEN) private readonly service: IAddressService) {}

    @Get()
    paginatedList(@Query() query?: AddressQueryDto) {
        return this.service.paginatedList(query);
    }

    @Get('list')
    list(@Query() query?: AddressQueryDto) {
        return this.service.list(query);
    }

    @Get(':id')
    get(@Param('id') id: UUID) {
        return this.service.get(id);
    }

    @Post()
    create(@Body() payload: AddressCreateCommandDto, @User() user: SharedUser) {
        return this.service.create(user, payload);
    }

    @Patch(':id')
    update(@Param('id') id: UUID, @Body() payload: AddressUpdateCommandDto, @User() user: SharedUser) {
        return this.service.update(user, id, payload);
    }

    @Delete(':id')
    delete(@User() user: SharedUser, @Param('id') id: UUID) {
        return this.service.delete(user, id, false);
    }
}
