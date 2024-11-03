import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { BrandSearchDto } from '@brand/domain/model/brand.dto';
import { IProductService, PRODUCT_SERVICE_TOKEN } from '@product/domain/ports/product-service.interface';
import { ProductCreateDto, ProductSearchDto, ProductUpdateDto } from '@product/domain/model/product.dto';

@Controller('product')
export class ProductController {
    constructor(@Inject(PRODUCT_SERVICE_TOKEN) private readonly service: IProductService) {}

    @Get()
    paginatedList(@Query() query?: ProductSearchDto) {
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
    create(@Body() payload: ProductCreateDto) {
        return this.service.create(payload);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() payload: ProductUpdateDto) {
        return this.service.update(id, payload);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.service.delete(id, false);
    }
}
