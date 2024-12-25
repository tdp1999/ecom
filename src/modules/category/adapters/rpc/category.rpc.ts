import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductCategoryAction } from '@shared/actions/product.action';
import { UUID } from '@shared/types/general.type';
import { CATEGORY_SERVICE_TOKEN, ICategoryService } from '@category/domain/ports/category-service.interface';
import { CATEGORY_REPOSITORY_TOKEN, ICategoryRepository } from '@category/domain/ports/category-repository.interface';

@Controller()
export class CategoryRpcController {
    constructor(
        @Inject(CATEGORY_SERVICE_TOKEN) private readonly service: ICategoryService,
        @Inject(CATEGORY_REPOSITORY_TOKEN) private readonly repository: ICategoryRepository,
    ) {}

    @MessagePattern(ProductCategoryAction.GET)
    async getCategoryForProduct(id: UUID) {
        return await this.service.get(id);
    }

    @MessagePattern(ProductCategoryAction.GET_BY_IDS)
    async getByIds(ids: UUID[]) {
        return await this.repository.findByIds(ids);
    }

    @MessagePattern(ProductCategoryAction.EXIST)
    async exist(id: UUID) {
        return await this.service.existAndValid(id);
    }
}
