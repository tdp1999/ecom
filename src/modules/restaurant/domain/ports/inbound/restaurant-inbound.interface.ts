import { UUID } from '@shared/types/general.type';
import { RestaurantCreateDto, RestaurantSearchDto, RestaurantUpdateDto } from '../../model/restaurant.dto';
import { Restaurant } from '../../model/restaurant.model';
import { Pagination } from '@shared/types/pagination.type';

export interface IRestaurantService {
    create(payload: RestaurantCreateDto): Promise<UUID>;
    get(id: UUID): Promise<Restaurant | null>;
    list(query?: RestaurantSearchDto): Promise<Pagination<Restaurant>>;
    update(id: UUID, payload: RestaurantUpdateDto): Promise<boolean>;
    delete(id: UUID): Promise<boolean>;
}

export const RESTAURANT_SERVICE_TOKEN = Symbol('IRestaurantService');
