import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductCategoryAction } from '@shared/actions/product.action';
import { UUID } from '@shared/types/general.type';
import { CATEGORY_SERVICE_TOKEN, ICategoryService } from '@category/domain/ports/category-service.interface';

@Controller()
export class CategoryRpcController {
    constructor(@Inject(CATEGORY_SERVICE_TOKEN) private readonly service: ICategoryService) {}

    @MessagePattern(ProductCategoryAction.GET)
    async getCategoryForProduct(id: UUID) {
        return await this.service.get(id);
    }
}
