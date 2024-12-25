import { Controller, Inject, UseFilters } from '@nestjs/common';
import { BRAND_SERVICE_TOKEN, IBrandService } from '@brand/domain/ports/brand-service.interface';
import { MessagePattern } from '@nestjs/microservices';
import { ProductBrandAction } from '@shared/actions/product.action';
import { RpcExceptionFilter } from '@shared/filters/rpc-exception.filter';
import { UUID } from '@shared/types/general.type';
import { BRAND_REPOSITORY_TOKEN, IBrandRepository } from '@brand/domain/ports/brand-repository.interface';

@Controller()
@UseFilters(RpcExceptionFilter)
export class BrandRpcController {
    constructor(
        @Inject(BRAND_SERVICE_TOKEN) private readonly service: IBrandService,
        @Inject(BRAND_REPOSITORY_TOKEN) protected readonly repository: IBrandRepository,
    ) {}

    @MessagePattern(ProductBrandAction.GET)
    async getBrandForProduct(id: UUID) {
        return await this.service.get(id);
    }

    // TODO: Refactor this. This is anti-pattern.
    @MessagePattern(ProductBrandAction.GET_BY_IDS)
    async getByIds(ids: UUID[]) {
        return await this.repository.findByIds(ids);
    }

    @MessagePattern(ProductBrandAction.EXIST)
    async exist(id: UUID) {
        return await this.service.exist(id);
    }
}
