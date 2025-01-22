import { CartListDto, CartRemoveItemDto, CartUpdateQuantityDto } from '@cart/domain/cart.dto';
import { ICartService } from '@cart/domain/ports/cart-service.interface';
import { Body, Controller, Delete, Get, Inject, Post, Query } from '@nestjs/common';
import { CART_SERVICE_TOKEN } from '../../domain/cart.token';

@Controller('cart')
export class CartController {
    constructor(@Inject(CART_SERVICE_TOKEN) private readonly service: ICartService) {}

    @Get()
    list(@Query() query: CartListDto) {
        return this.service.list(query);
    }

    @Post()
    updateQuantity(@Body() payload: CartUpdateQuantityDto) {
        return this.service.updateQuantity(payload);
    }

    @Delete()
    removeItem(@Body() payload: CartRemoveItemDto) {
        return this.service.removeItem(payload);
    }

    @Delete()
    clear(@Body() payload: CartRemoveItemDto) {
        return this.service.clear(payload);
    }
}
