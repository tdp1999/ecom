import { UUID } from '@shared/types/general.type';
import { CartItem, CartItemIdentifier } from '../cart.model';

export interface ICartRepository {
    listItem(userId: UUID): Promise<CartItem[]>;

    getItemByIdentifier(identifier: CartItemIdentifier, visibleColumns?: (keyof CartItem)[]): Promise<CartItem | null>;

    getItemById(id: UUID): Promise<CartItem | null>;

    exist(id: UUID): Promise<boolean>;

    addItemToCart(item: CartItem): Promise<CartItem>;

    removeItemFromCart(id: UUID): Promise<boolean>;

    updateItemQuantity(id: UUID, quantity: number): Promise<CartItem>;

    clearCart(userId: UUID): Promise<boolean>;
}
