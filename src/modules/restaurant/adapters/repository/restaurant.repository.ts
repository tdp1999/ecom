import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityRepository } from '@shared/decorators/entity-repository.decorator';
import { UUID } from '@shared/types/general.type';
import { Pagination } from '@shared/types/pagination.type';
import { EntityManager, FindOptionsWhere } from 'typeorm';
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

    async count(query: Record<string, any>): Promise<number> {
        return this.repository.count({
            where: query,
        });
    }

    async create(restaurant: Restaurant): Promise<boolean> {
        await this.repository.insert(restaurant);
        return true;
    }

    get(id: string): Promise<Restaurant | null> {
        return this.repository.findOneBy({ id });
    }

    async list(query?: RestaurantSearchDto): Promise<Pagination<Restaurant>> {
        const { limit = 10, page = 1, orderBy = 'name', orderType = 'ASC', ...filters } = query || {};

        // Build search conditions dynamically
        const where: FindOptionsWhere<Restaurant> = {};

        if (filters.name) {
            where.name = filters.name;
        }

        if (filters.address) {
            where.address = filters.address;
        }

        if (filters.categories) {
            where.categories = filters.categories.join(','); // Assuming simple-array structure
        }

        if (filters.status) {
            where.status = filters.status;
        }

        const [items, total] = await this.repository.findAndCount({
            where,
            take: limit,
            skip: (page - 1) * limit,
            order: {
                [orderBy]: orderType.toUpperCase() === 'ASC' ? 'ASC' : 'DESC', // Ensure correct order type
            },
        });

        const totalPages = Math.ceil(total / limit);

        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    }

    update(id: UUID, data: RestaurantUpdateDto): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    delete(id: UUID): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
}
