import { Controller, Get, Inject, Query } from '@nestjs/common';
import { IPermissionService } from '../domain/permission-service.interface';
import { PermissionSearchDto } from '../domain/permission.dto';
import { PERMISSION_SERVICE_TOKEN } from '../domain/permission.token';

@Controller('permission')
export class PermissionController {
    constructor(@Inject(PERMISSION_SERVICE_TOKEN) private readonly service: IPermissionService) {}

    // @Get()
    // paginatedList(@Query() query?: PermissionSearchDto) {
    //     return this.service.paginatedList(query);
    // }

    @Get('list')
    list(@Query() query?: PermissionSearchDto) {
        return this.service.list(query);
    }

    // @Get(':id')
    // get(@Param('id') id: string) {
    //     return this.service.get(id);
    // }
    //
    // @Post()
    // create(@Body() payload: PermissionCreateDto, @User() user: SharedUser) {
    //     return this.service.create(user, payload);
    // }
    //
    // @Patch(':id')
    // update(@User() user: SharedUser, @Param('id') id: string, @Body() payload: PermissionUpdateDto) {
    //     return this.service.update(user, id, payload);
    // }
    //
    // @Delete(':id')
    // delete(@User() user: SharedUser, @Param('id') id: string) {
    //     return this.service.delete(user, id, false);
    // }
}
