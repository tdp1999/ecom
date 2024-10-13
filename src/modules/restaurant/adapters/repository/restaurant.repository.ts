import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityRepository } from '@shared/decorators/entity-repository.decorator';
import { UUID } from '@shared/types/general.type';
import { EntityManager } from 'typeorm';
import { RestaurantSearchDto, RestaurantUpdateDto } from '../../domain/model/restaurant.dto';
import { Restaurant } from '../../domain/model/restaurant.model';
import { IRestaurantRepository } from '../../domain/ports/outbound/restaurant-outbound.interface';
import { RestaurantEntity } from './restaurant.entity';

@EntityRepository(RestaurantEntity)
export class RestaurantRepository implements IRestaurantRepository {
    @InjectEntityManager() private readonly manager: EntityManager;

    private get repository() {
        return this.manager.getRepository(RestaurantEntity);
    }

    async create(restaurant: Restaurant): Promise<boolean> {
        await this.repository.insert(restaurant);
        return true;
    }

    get(id: string): Promise<Restaurant | null> {
        return this.repository.findOneBy({ id }) as Promise<Restaurant | null>;
    }

    list(query?: RestaurantSearchDto): Promise<Restaurant[]> {
        return this.repository.find();
    }

    update(id: UUID, data: RestaurantUpdateDto): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    delete(id: UUID): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
}
