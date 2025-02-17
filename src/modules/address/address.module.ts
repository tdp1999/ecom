import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionManager } from '@shared/decorators/transactional.decorator';
import { MODULE_IDENTIFIER } from '@shared/tokens/common.token';
import { AddressService } from './application/address.service';
import { ADDRESS_REPOSITORY_TOKEN, ADDRESS_SERVICE_TOKEN } from './application/address.token';
import { AddressController } from './infrastructure/address.controller';
import { AddressEntity } from './infrastructure/address.persistence';
import { AddressRepository } from './infrastructure/address.repository';

@Module({
    controllers: [AddressController],
    imports: [TypeOrmModule.forFeature([AddressEntity])],
    providers: [
        TransactionManager,
        {
            provide: MODULE_IDENTIFIER,
            useValue: 'Address',
        },
        {
            provide: ADDRESS_REPOSITORY_TOKEN,
            useClass: AddressRepository,
        },
        {
            provide: ADDRESS_SERVICE_TOKEN,
            useClass: AddressService,
        },
    ],
})
export class AddressModule {}
