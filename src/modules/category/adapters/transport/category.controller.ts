import { CATEGORY_SERVICE_TOKEN, ICategoryService } from '@category/domain/ports/category-service.interface';
import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { User } from '@shared/decorators/user.decorator';
import { SharedUser } from '@shared/types/user.shared.type';
import { CategoryCreateDto, CategorySearchDto, CategoryUpdateDto } from '../../domain/model/category.dto';

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
    getFullTree() {
        return this.service.getFullTree();
    }

    @Get(':id')
    get(@Param('id') id: string) {
        return this.service.get(id);
    }

    @Post()
    create(@Body() payload: CategoryCreateDto, @User() user: SharedUser) {
        return this.service.create(user, payload);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() payload: CategoryUpdateDto, @User() user: SharedUser) {
        return this.service.update(user, id, payload);
    }

    @Delete(':id')
    delete(@User() user: SharedUser, @Param('id') id: string) {
        return this.service.delete(user, id, false);
    }
}
