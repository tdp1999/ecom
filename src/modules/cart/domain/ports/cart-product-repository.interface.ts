import { CacheResult } from '@shared/cache/cache.interface';
import { UUID } from '@shared/types/general.type';
import { CartProduct } from '../cart.model';

export interface ICartProductRepository {
    load(id: UUID): Promise<CartProduct | null>;

    loadByIds(ids: UUID[]): Promise<CacheResult<CartProduct>>;
}
