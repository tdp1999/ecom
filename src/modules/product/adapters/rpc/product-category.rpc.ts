import { IProductCategoryRepository } from '@product/domain/ports/product-repository.interface';
import { UUID } from '@shared/types/general.type';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ProductCategoryAction } from '@shared/actions/product.action';
import DataLoader from 'dataloader';
import { ProductCategory } from '@product/domain/model/product.model';

export class ProductCategoryRpcRepository implements IProductCategoryRepository {
    public categoriesLoader: DataLoader<UUID, ProductCategory | null>;

    constructor(@Inject('PRODUCT_PROXY') private readonly client: ClientProxy) {
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
        return ids.map((id) => categoryMap.get(id) || null);
    }
}
