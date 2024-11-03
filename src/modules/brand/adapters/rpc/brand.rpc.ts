import { Controller, Inject } from '@nestjs/common';
import { BRAND_SERVICE_TOKEN, IBrandService } from '@brand/domain/ports/brand-service.interface';
import { MessagePattern } from '@nestjs/microservices';
import { ProductBrandAction } from '@shared/actions/product.action';
import { UUID } from '@shared/types/general.type';

@Controller()
export class BrandRpcController {
    constructor(@Inject(BRAND_SERVICE_TOKEN) private readonly service: IBrandService) {}

    @MessagePattern(ProductBrandAction.GET)
    async getBrandForProduct(id: UUID) {
        return await this.service.get(id);
    }
}
