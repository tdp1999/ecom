import { BrandRpcController } from '@brand/adapters/rpc/brand.rpc';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionManager } from '@shared/decorators/transactional.decorator';
import { MODULE_IDENTIFIER } from '@shared/tokens/common.token';
import { BrandEntity } from './adapters/repository/brand.entity';
import { BrandRepository } from './adapters/repository/brand.repository';
import { BrandController } from './adapters/transport/brand.controller';
import { BRAND_REPOSITORY_TOKEN } from './domain/ports/brand-repository.interface';
import { BRAND_SERVICE_TOKEN } from './domain/ports/brand-service.interface';
import { BrandService } from './domain/services/brand.service';

@Module({
    controllers: [BrandController, BrandRpcController],
    imports: [TypeOrmModule.forFeature([BrandEntity])],
    providers: [
        TransactionManager,
        {
            provide: MODULE_IDENTIFIER,
            useValue: 'Brand',
        },
        {
            provide: BRAND_REPOSITORY_TOKEN,
            useClass: BrandRepository,
        },
        {
            provide: BRAND_SERVICE_TOKEN,
            useClass: BrandService,
        },
    ],
})
export class BrandModule {}
