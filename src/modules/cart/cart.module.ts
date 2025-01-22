import { CartRepository } from '@cart/adapters/repository/cart.repository';
import { CartProductRpcRepository } from '@cart/adapters/rpc/cart-product.rpc';
import { CartController } from '@cart/adapters/tranport/cart.controller';
import { CartService } from '@cart/domain/cart.service';
import { CART_PRODUCT_REPOSITORY_TOKEN, CART_REPOSITORY_TOKEN, CART_SERVICE_TOKEN } from '@cart/domain/cart.token';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from '@shared/modules/client/client.module';
import { MODULE_IDENTIFIER } from '@shared/tokens/common.token';
import { CartEntity } from './adapters/repository/cart.entity';

@Module({
    controllers: [CartController],
    imports: [TypeOrmModule.forFeature([CartEntity]), ClientModule.registerAsync()],
    providers: [
        {
            provide: MODULE_IDENTIFIER,
            useValue: 'Cart',
        },
        {
            provide: CART_REPOSITORY_TOKEN,
            useClass: CartRepository,
        },
        {
            provide: CART_PRODUCT_REPOSITORY_TOKEN,
            useClass: CartProductRpcRepository,
        },
        {
            provide: CART_SERVICE_TOKEN,
            useClass: CartService,
        },
    ],
})
export class CartModule {}
