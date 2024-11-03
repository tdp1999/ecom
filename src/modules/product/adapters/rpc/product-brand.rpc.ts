import { IProductBrandRepository } from '@product/domain/ports/product-repository.interface';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UUID } from '@shared/types/general.type';
import { lastValueFrom } from 'rxjs';
import { ProductBrandAction } from '@shared/actions/product.action';

export class ProductBrandRpcRepository implements IProductBrandRepository {
    constructor(@Inject('PRODUCT_PROXY') private readonly client: ClientProxy) {}

    get(id: UUID) {
        return lastValueFrom(this.client.send(ProductBrandAction.GET, id));
    }
}
