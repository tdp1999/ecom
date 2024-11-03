import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionManager } from '@shared/decorators/transactional.decorator';
import { MODULE_IDENTIFIER } from '@shared/tokens/common.token';
import { CategoryEntity } from './adapters/repository/category.entity';
import { CategoryRepository } from './adapters/repository/category.repository';
import { CategoryController } from './adapters/transport/category.controller';
import { CATEGORY_REPOSITORY_TOKEN } from './domain/ports/category-repository.interface';
import { CATEGORY_SERVICE_TOKEN } from './domain/ports/category-service.interface';
import { CategoryService } from './domain/services/category.service';
import { CategoryRpcController } from '@category/adapters/rpc/category.rpc';

@Module({
    controllers: [CategoryController, CategoryRpcController],
    imports: [TypeOrmModule.forFeature([CategoryEntity])],
    providers: [
        TransactionManager,
        {
            provide: MODULE_IDENTIFIER,
            useValue: 'Category',
        },
        {
            provide: CATEGORY_REPOSITORY_TOKEN,
            useClass: CategoryRepository,
        },
        {
            provide: CATEGORY_SERVICE_TOKEN,
            useClass: CategoryService,
        },
    ],
})
export class CategoryModule {}
