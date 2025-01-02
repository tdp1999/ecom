import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProductCategory } from '@product/domain/model/product.model';
import { IProductCategoryRepository } from '@product/domain/ports/product-repository.interface';
import { ProductCategoryAction } from '@shared/actions/product.action';
import { CLIENT_PROXY } from '@shared/modules/client/client.module';
import { UUID } from '@shared/types/general.type';
import DataLoader from 'dataloader';
import { lastValueFrom } from 'rxjs';

export class ProductCategoryRpcRepository implements IProductCategoryRepository {
    public categoriesLoader: DataLoader<UUID, ProductCategory | null>;

    constructor(@Inject(CLIENT_PROXY) private readonly client: ClientProxy) {
        this.categoriesLoader = new DataLoader(this.categoryBatchFn.bind(this), { maxBatchSize: 100 });
    }

    async get(id: UUID) {
        return await lastValueFrom(this.client.send(ProductCategoryAction.GET, id));
    }

    async load(id: UUID) {
        return await this.categoriesLoader.load(id);
    }

    async getByIds(ids: UUID[]) {
        const results = await this.categoriesLoader.loadMany(ids);
        return results.map((result) => {
            if (result instanceof Error) {
                console.error('Error loading category:', result);
                return null;
            }

            return result;
        });
    }

    async exist(id: UUID) {
        return await lastValueFrom(this.client.send(ProductCategoryAction.EXIST, id));
    }

    private async categoryBatchFn(ids: UUID[]) {
        const categories = await lastValueFrom(
            this.client.send<ProductCategory[]>(ProductCategoryAction.GET_BY_IDS, ids),
        );
        const categoryMap = new Map(categories.map((category) => [category.id, category]));

        // Ensure that the order of the ids is the same as the order of the categories.
        // Read this: https://www.npmjs.com/package/dataloader
        return ids.map((id) => categoryMap.get(id) || null);
    }
}
