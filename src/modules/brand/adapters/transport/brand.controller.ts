import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { User } from '@shared/decorators/user.decorator';
import { SharedUser } from '@shared/types/user.shared.type';
import { BrandCreateDto, BrandFindOneDto, BrandSearchDto, BrandUpdateDto } from '../../domain/model/brand.dto';
import { BRAND_SERVICE_TOKEN, IBrandService } from '@brand/domain/ports/brand-service.interface';

@Controller('brand')
export class BrandController {
    constructor(@Inject(BRAND_SERVICE_TOKEN) private readonly service: IBrandService) {}

    @Get()
    paginatedList(@Query() query?: BrandSearchDto) {
        return this.service.paginatedList(query);
    }

    @Get('list')
    list(@Query() query?: BrandSearchDto) {
        return this.service.list(query);
    }

    @Get('name')
    getByConditions(@Query() conditions?: BrandFindOneDto) {
        return this.service.getByConditions(conditions);
    }

    @Get(':id')
    get(@Param('id') id: string) {
        return this.service.get(id);
    }

    @Post()
    create(@Body() payload: BrandCreateDto, @User() user: SharedUser) {
        return this.service.create(user, payload);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() payload: BrandUpdateDto, @User() user: SharedUser) {
        return this.service.update(user, id, payload);
    }

    @Delete(':id')
    delete(@User() user: SharedUser, @Param('id') id: string) {
        return this.service.delete(user, id, false);
    }
}
