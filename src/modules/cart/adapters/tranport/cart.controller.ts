import { CartUpdateQuantityDto } from '@cart/domain/cart.dto';
import { ICartService } from '@cart/domain/ports/cart-service.interface';
import { Body, Controller, Delete, Get, Inject, Param, Post } from '@nestjs/common';
import { User } from '@shared/decorators/user.decorator';
import { UUID } from '@shared/types/general.type';
import { SharedUser } from '@shared/types/user.shared.type';
import { CART_SERVICE_TOKEN } from '../../domain/cart.token';

@Controller('cart')
export class CartController {
    constructor(@Inject(CART_SERVICE_TOKEN) private readonly service: ICartService) {}

    @Get()
    list(@User() user: SharedUser) {
        return this.service.list(user.id);
    }

    @Post()
    updateQuantity(@User() user: SharedUser, @Body() payload: CartUpdateQuantityDto) {
        payload.userId = user.id;
        return this.service.updateQuantity(payload);
    }

    @Delete(':id')
    removeItem(@User() user: SharedUser, @Param('id') id: UUID) {
        return this.service.removeItem(id, user.id);
    }

    @Delete()
    clear(@User() user: SharedUser) {
        return this.service.clear(user.id);
    }
}
