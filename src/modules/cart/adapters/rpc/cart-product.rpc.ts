import { CartProduct } from '@cart/domain/cart.model';
import { ICartProductRepository } from '@cart/domain/ports/cart-product-repository.interface';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CartProductAction } from '@shared/actions/cart.action';
import { CacheFactory } from '@shared/cache/cache.factory';
import { CacheRepository, CacheResult, CacheService } from '@shared/cache/cache.interface';
import { RpcClient } from '@shared/decorators/client.rpc.decorator';
import { CLIENT_PROXY } from '@shared/modules/client/client.module';
import { UUID } from '@shared/types/general.type';
import { lastValueFrom } from 'rxjs';

export class CartProductRpcRepository implements ICartProductRepository, CacheRepository<CartProduct> {
    private cacheService: CacheService<CartProduct>;

    constructor(@Inject(CLIENT_PROXY) private readonly client: ClientProxy) {
        this.cacheService = CacheFactory.createCacheService<CartProduct>('memory', this);
    }

    load(id: UUID): Promise<CartProduct | null> {
        return this.cacheService.getItem(id);
    }

    loadByIds(ids: UUID[]): Promise<CacheResult<CartProduct>> {
        return this.cacheService.getItems(ids);
    }

    @RpcClient()
    async findById(id: UUID): Promise<CartProduct | null> {
        return await lastValueFrom(this.client.send(CartProductAction.GET, id));
    }

    @RpcClient()
    async findByIds(ids: UUID[]): Promise<CartProduct[]> {
        return await lastValueFrom(this.client.send(CartProductAction.GET_BY_IDS, ids));
    }
}
