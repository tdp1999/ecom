import { Controller, Inject, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IProductRepository, PRODUCT_REPOSITORY_TOKEN } from '@product/domain/ports/product-repository.interface';
import { CartProductAction } from '@shared/actions/cart.action';
import { RpcExceptionFilter } from '@shared/filters/rpc-exception.filter';
import { UUID } from '@shared/types/general.type';

@Controller()
@UseFilters(RpcExceptionFilter)
export class ProductRpcController {
    constructor(@Inject(PRODUCT_REPOSITORY_TOKEN) private readonly repository: IProductRepository) {}

    @MessagePattern(CartProductAction.GET)
    async getProductForCart(id: UUID) {
        return this.repository.findById(id);
    }

    @MessagePattern(CartProductAction.GET_BY_IDS)
    async getProductsForCart(ids: UUID[]) {
        return this.repository.findByIds(ids);
    }
}
