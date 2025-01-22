import { CartListDto, CartRemoveItemDto, CartUpdateQuantityDto } from '@cart/domain/cart.dto';
import { ICartService } from '@cart/domain/ports/cart-service.interface';
import { Body, Controller, Delete, Get, Inject, Post, Query } from '@nestjs/common';
import { IUseCase } from '@shared/interfaces/use-case.interface';
import { CART_SERVICE_TOKEN, CART_UPDATE_QUANTITY_USE_CASE } from '../../domain/cart.token';

@Controller('cart')
export class CartController {
    constructor(
        @Inject(CART_SERVICE_TOKEN) private readonly service: ICartService,
        @Inject(CART_UPDATE_QUANTITY_USE_CASE) private readonly updateQuantityUseCase: IUseCase<CartUpdateQuantityDto>,
    ) {}

    @Get()
    list(@Query() query: CartListDto) {
        return this.service.list(query);
    }

    @Post()
    updateQuantity(@Body() payload: CartUpdateQuantityDto) {
        return this.updateQuantityUseCase.execute(payload);
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
