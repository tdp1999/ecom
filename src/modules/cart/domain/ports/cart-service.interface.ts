import { UUID } from '@shared/types/general.type';
import { CartUpdateQuantityDto } from '../cart.dto';
import { CartItem } from '../cart.model';

export interface ICartService {
    list(userId: UUID): Promise<CartItem[]>;

    removeItem(id: UUID, userId: UUID): Promise<boolean>;

    clear(userId: UUID): Promise<boolean>;

    updateQuantity(payload: CartUpdateQuantityDto): Promise<boolean>;
}
