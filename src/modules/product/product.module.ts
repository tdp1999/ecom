import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductBrandRpcRepository } from '@product/adapters/rpc/product-brand.rpc';
import { ProductCategoryRpcRepository } from '@product/adapters/rpc/product-category.rpc';
import { ProductRpcController } from '@product/adapters/rpc/product.rpc';
import { PRODUCT_BRAND_REPOSITORY_TOKEN, PRODUCT_CATEGORY_REPOSITORY_TOKEN } from '@product/domain/model/product.token';
import { TransactionManager } from '@shared/decorators/transactional.decorator';
import { ClientModule } from '@shared/modules/client/client.module';
import { MODULE_IDENTIFIER } from '@shared/tokens/common.token';
import { ProductEntity } from './adapters/repository/product.entity';
import { ProductRepository } from './adapters/repository/product.repository';
import { ProductController } from './adapters/transport/product.controller';
import { PRODUCT_REPOSITORY_TOKEN } from './domain/ports/product-repository.interface';
import { PRODUCT_SERVICE_TOKEN } from './domain/ports/product-service.interface';
import { ProductService } from './domain/service/product.service';

@Module({
    controllers: [ProductController, ProductRpcController],
    imports: [TypeOrmModule.forFeature([ProductEntity]), ClientModule.registerAsync()],
    providers: [
        TransactionManager,
        {
            provide: MODULE_IDENTIFIER,
            useValue: 'Product',
        },
        {
            provide: PRODUCT_REPOSITORY_TOKEN,
            useClass: ProductRepository,
        },
        {
            provide: PRODUCT_BRAND_REPOSITORY_TOKEN,
            useClass: ProductBrandRpcRepository,
        },
        {
            provide: PRODUCT_CATEGORY_REPOSITORY_TOKEN,
            useClass: ProductCategoryRpcRepository,
        },
        {
            provide: PRODUCT_SERVICE_TOKEN,
            useClass: ProductService,
        },
    ],
})
export class ProductModule {}
