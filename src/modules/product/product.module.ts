import { Module } from '@nestjs/common';
import { TransactionManager } from '@shared/decorators/transactional.decorator';
import { MODULE_IDENTIFIER } from '@shared/tokens/common.token';
import { PRODUCT_REPOSITORY_TOKEN } from './domain/ports/product-repository.interface';
import { PRODUCT_SERVICE_TOKEN } from './domain/ports/product-service.interface';
import { ProductService } from './domain/service/product.service';
import { ProductRepository } from './adapters/repository/product.repository';
import { ProductController } from './adapters/transport/product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './adapters/repository/product.entity';

@Module({
    controllers: [ProductController],
    imports: [TypeOrmModule.forFeature([ProductEntity])],
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
            provide: PRODUCT_SERVICE_TOKEN,
            useClass: ProductService,
        },
    ],
})
export class ProductModule {}
