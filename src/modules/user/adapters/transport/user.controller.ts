import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { UserCreateDto, UserSearchDto, UserUpdateDto } from '../../domain/model/user.dto';
import { USER_SERVICE_TOKEN } from '../../domain/model/user.token';
import { IUserService } from '../../domain/ports/user-service.interface';

@Controller('user')
export class UserController {
    constructor(@Inject(USER_SERVICE_TOKEN) private readonly service: IUserService) {}

    @Get()
    paginatedList(@Query() query?: UserSearchDto) {
        return this.service.paginatedList(query);
    }

    @Get('list')
    list(@Query() query?: UserSearchDto) {
        return this.service.list(query);
    }

    // @Get('name')
    // getByConditions(@Query() conditions?: UserFindOneDto) {
    //     console.log('Conditions: ', conditions);
    //     return this.service.getByConditions(conditions);
    // }

    @Get(':id')
    get(@Param('id') id: string) {
        return this.service.get(id);
    }

    @Post()
    create(@Body() payload: UserCreateDto) {
        return this.service.create(payload);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() payload: UserUpdateDto) {
        // this.logger.log('Updating user with id: ', id);
        return this.service.update(id, payload);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.service.delete(id, false);
    }
}
