import { IProductBrandRepository } from '@product/domain/ports/product-repository.interface';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CLIENT_PROXY } from '@shared/modules/client/client.module';
import { UUID } from '@shared/types/general.type';
import { lastValueFrom } from 'rxjs';
import { ProductBrandAction } from '@shared/actions/product.action';
import DataLoader from 'dataloader';
import { ProductBrand } from '@product/domain/model/product.model';

export class ProductBrandRpcRepository implements IProductBrandRepository {
    public brandsLoader: DataLoader<UUID, ProductBrand | null>;

    constructor(@Inject(CLIENT_PROXY) private readonly client: ClientProxy) {
        this.brandsLoader = new DataLoader(this.brandBatchFn.bind(this), { maxBatchSize: 100 });
    }

    async get(id: UUID) {
        return await lastValueFrom(this.client.send(ProductBrandAction.GET, id));
    }

    async load(id: UUID): Promise<ProductBrand | null> {
        return await this.brandsLoader.load(id);
    }

    async getByIds(ids: UUID[]) {
        const results = await this.brandsLoader.loadMany(ids);

        return results.map((result) => {
            if (result instanceof Error) {
                console.error('Error loading brand:', result);
                return null;
            }

            return result;
        });
    }

    async exist(id: UUID) {
        return await lastValueFrom(this.client.send(ProductBrandAction.EXIST, id));
    }

    private async brandBatchFn(ids: UUID[]) {
        const brands = await lastValueFrom(this.client.send<ProductBrand[]>(ProductBrandAction.GET_BY_IDS, ids));
        const brandMap = new Map(brands.map((brand) => [brand.id, brand]));
        return ids.map((id) => brandMap.get(id) || null);
    }
}
