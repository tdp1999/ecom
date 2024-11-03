import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { CategoryCreateDto, CategorySearchDto, CategoryUpdateDto } from '../../domain/model/category.dto';
import { CATEGORY_SERVICE_TOKEN, ICategoryService } from '@category/domain/ports/category-service.interface';

@Controller('category')
export class CategoryController {
    constructor(@Inject(CATEGORY_SERVICE_TOKEN) private readonly service: ICategoryService) {}

    @Get()
    paginatedList(@Query() query?: CategorySearchDto) {
        return this.service.paginatedList(query);
    }

    @Get('list')
    list(@Query() query?: CategorySearchDto) {
        return this.service.list(query);
    }

    @Get('tree')
    getFullTree(@Query() query?: CategorySearchDto) {
        return this.service.getFullTree(query);
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
