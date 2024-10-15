import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityRepository } from '@shared/decorators/entity-repository.decorator';
import { UUID } from '@shared/types/general.type';
import { Pagination } from '@shared/types/pagination.type';
import { EntityManager, FindOptionsWhere, ILike } from 'typeorm';
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

    get(id: string): Promise<Restaurant | null> {
        return this.repository.findOneBy({ id });
    }

    async paginatedList(query?: RestaurantSearchDto): Promise<Pagination<Restaurant>> {
        const { limit = 10, page = 1, orderBy, orderType } = query || {};

        const [items, total] = await this.repository.findAndCount({
            where: this._buildWhereConditions(query),
            take: limit,
            skip: (page - 1) * limit,
            order: this._buildOrderConditions({ orderBy, orderType }),
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

    async list(query?: RestaurantSearchDto): Promise<Restaurant[]> {
        const { orderBy, orderType } = query || {};

        const items = await this.repository.find({
            where: this._buildWhereConditions(query),
            order: this._buildOrderConditions({ orderBy, orderType }),
        });

        return items;
    }

    /**
     * All the valid/undefined checking should be done in the service/use-case layer, so here we just need to call the repository's method
     * */
    async create(restaurant: Restaurant): Promise<boolean> {
        await this.repository.insert(restaurant);
        return true;
    }

    async update(id: UUID, data: RestaurantUpdateDto): Promise<boolean> {
        await this.repository.update(id, data);
        return true;
    }

    async delete(id: UUID): Promise<boolean> {
        await this.repository.delete({ id });
        return true;
    }

    private _buildWhereConditions(query?: RestaurantSearchDto) {
        const { limit = 10, page = 1, orderBy = 'name', orderType = 'ASC', ...filters } = query || {};

        // Build search conditions dynamically
        const where: FindOptionsWhere<Restaurant> = {
            isDeleted: false,
        };

        if (filters.name) {
            where.name = ILike(`%${filters.name}%`); // Fuzzy search
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

        return where;
    }

    private _buildOrderConditions(query?: RestaurantSearchDto) {
        const { orderBy, orderType } = query || {};

        if (!orderBy || !orderType) {
            return {};
        }

        return {
            [orderBy]: orderType.toUpperCase() === 'ASC' ? 'ASC' : 'DESC', // Ensure correct order type
        };
    }
}
