import { CartClearDto, CartListDto, CartRemoveItemDto, CartUpdateQuantityDto } from '../cart.dto';
import { CartItem } from '../cart.model';

export interface ICartService {
    list(payload: CartListDto): Promise<CartItem[]>;

    removeItem(payload: CartRemoveItemDto): Promise<boolean>;

    clear(payload: CartClearDto): Promise<boolean>;

    updateQuantity(payload: CartUpdateQuantityDto): Promise<boolean>;
}
