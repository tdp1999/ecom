import { Controller, Get, Inject, Query } from '@nestjs/common';
import { BrandSearchDto } from '../../domain/model/brand.dto';
import { BRAND_SERVICE_TOKEN, IBrandService } from '../../domain/ports/brand-service.interface';

@Controller('brand')
export class BrandController {
    constructor(@Inject(BRAND_SERVICE_TOKEN) private readonly service: IBrandService) {}

    @Get('list')
    list(@Query() query?: BrandSearchDto) {
        return this.service.list(query);
    }
}
