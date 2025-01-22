import { CartClearDto, CartListDto, CartRemoveItemDto, CartUpdateQuantityDto } from '../cart.dto';
import { CartItem } from '../cart.model';

export interface ICartRepository {
    list(payload: CartListDto): Promise<CartItem[]>;

    updateQuantity(payload: CartUpdateQuantityDto): Promise<boolean>;

    removeItem(payload: CartRemoveItemDto): Promise<boolean>;

    clear(payload: CartClearDto): Promise<boolean>;
}
