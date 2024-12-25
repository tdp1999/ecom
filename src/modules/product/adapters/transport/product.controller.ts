import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { BrandSearchDto } from '@brand/domain/model/brand.dto';
import { IProductService, PRODUCT_SERVICE_TOKEN } from '@product/domain/ports/product-service.interface';
import { ProductCreateDto, ProductSearchDto, ProductUpdateDto } from '@product/domain/model/product.dto';
import { User } from '@shared/decorators/user.decorator';
import { SharedUser } from '@shared/types/user.shared.type';

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
    create(@Body() payload: ProductCreateDto, @User() user: SharedUser) {
        return this.service.create(user, payload);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() payload: ProductUpdateDto, @User() user: SharedUser) {
        return this.service.update(user, id, payload);
    }

    @Delete(':id')
    delete(@User() user: SharedUser, @Param('id') id: string) {
        return this.service.delete(user, id, false);
    }
}
