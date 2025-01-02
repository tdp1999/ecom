import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { User } from '@shared/decorators/user.decorator';
import { SharedUser } from '@shared/types/user.shared.type';
import { IRoleService } from '../domain/role-service.interface';
import { RoleCreateDto, RoleSearchDto, RoleUpdateDto } from '../domain/role.dto';
import { ROLE_SERVICE_TOKEN } from '../domain/role.token';

@Controller('role')
export class RoleController {
    constructor(@Inject(ROLE_SERVICE_TOKEN) private readonly service: IRoleService) {}

    @Get()
    paginatedList(@Query() query?: RoleSearchDto) {
        return this.service.paginatedList(query);
    }

    @Get('list')
    list(@Query() query?: RoleSearchDto) {
        return this.service.list(query);
    }

    @Get(':id')
    get(@Param('id') id: string) {
        return this.service.get(id);
    }

    @Post()
    create(@Body() payload: RoleCreateDto, @User() user: SharedUser) {
        return this.service.create(user, payload);
    }

    @Patch(':id')
    update(@User() user: SharedUser, @Param('id') id: string, @Body() payload: RoleUpdateDto) {
        return this.service.update(user, id, payload);
    }

    @Delete(':id')
    delete(@User() user: SharedUser, @Param('id') id: string) {
        return this.service.delete(user, id, false);
    }
}
