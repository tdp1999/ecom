import { UUID } from '@shared/types/general.type';
import { Category } from '../../model/category.model';
import { CategorySearchDto } from '../../model/category.dto';

export interface ICategoryRepository {
    get(id: UUID): Promise<Category | null>;
    list(query: CategorySearchDto): Promise<Category[]>;
}
