import { CartProduct } from '@cart/domain/cart.model';
import { ICartProductRepository } from '@cart/domain/ports/cart-product-repository.interface';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CacheResult } from '@shared/cache/cache.interface';
import { CLIENT_PROXY } from '@shared/modules/client/client.module';
import { UUID } from '@shared/types/general.type';

export class CartProductRpcRepository implements ICartProductRepository {
    constructor(@Inject(CLIENT_PROXY) private readonly client: ClientProxy) {}

    load(id: UUID): Promise<CartProduct | null> {
        throw new Error('Method not implemented.');
    }

    loadByIds(ids: UUID[]): Promise<CacheResult<CartProduct>> {
        throw new Error('Method not implemented.');
    }
}
