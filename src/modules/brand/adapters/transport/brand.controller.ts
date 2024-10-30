import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { BrandSearchDto } from '../../domain/model/brand.dto';
import { CategoryCreateDto, CategorySearchDto, CategoryUpdateDto } from '@category/domain/model/category.dto';
import { BRAND_SERVICE_TOKEN, IBrandService } from '@brand/domain/ports/brand-service.interface';

@Controller('brand')
export class BrandController {
    constructor(@Inject(BRAND_SERVICE_TOKEN) private readonly service: IBrandService) {}

    @Get()
    paginatedList(@Query() query?: CategorySearchDto) {
        return this.service.paginatedList(query);
    }

    @Get('list')
    list(@Query() query?: BrandSearchDto) {
        return this.service.list(query);
    }

    @Get(':id')
    get(@Param('id') id: string) {
        return this.service.get(id);
    }

    @Post()
    create(@Body() payload: CategoryCreateDto) {
        return this.service.create(payload);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() payload: CategoryUpdateDto) {
        return this.service.update(id, payload);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.service.delete(id, false);
    }
}
