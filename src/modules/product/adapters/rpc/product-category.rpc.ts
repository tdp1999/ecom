import { IProductCategoryRepository } from '@product/domain/ports/product-repository.interface';
import { UUID } from '@shared/types/general.type';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ProductCategoryAction } from '@shared/actions/product.action';

export class ProductCategoryRpcRepository implements IProductCategoryRepository {
    constructor(@Inject('PRODUCT_PROXY') private readonly client: ClientProxy) {}

    get(id: UUID) {
        return lastValueFrom(this.client.send(ProductCategoryAction.GET, id));
    }
}
