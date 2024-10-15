import { Inject } from '@nestjs/common';
import { STATUS } from '@shared/enums/status.enum';
import { BadRequestError, NotFoundError } from '@shared/errors/common-errors';
import { formatZodError } from '@shared/errors/error-formatter';
import { UUID } from '@shared/types/general.type';
import { Pagination } from '@shared/types/pagination.type';
import { v7 } from 'uuid';
import {
    RestaurantCreateDto,
    RestaurantCreateSchema,
    RestaurantSearchDto,
    RestaurantSearchSchema,
    RestaurantUpdateDto,
} from '../model/restaurant.dto';
import { Restaurant } from '../model/restaurant.model';
import { IRestaurantService } from '../ports/inbound/restaurant-inbound.interface';
import { IRestaurantRepository, RESTAURANT_REPOSITORY_TOKEN } from '../ports/outbound/restaurant-outbound.interface';

export class RestaurantService implements IRestaurantService {
    constructor(@Inject(RESTAURANT_REPOSITORY_TOKEN) private readonly repository: IRestaurantRepository) {}

    async create(payload: RestaurantCreateDto): Promise<UUID> {
        const { success, error, data } = RestaurantCreateSchema.safeParse(payload);

        if (!success) {
            throw BadRequestError(formatZodError(error));
        }

        const id = v7();
        const currentTimestamp = BigInt(Date.now());
        const restaurant: Restaurant = { id, ...data, createdAt: currentTimestamp, updatedAt: currentTimestamp };
        await this.repository.create(restaurant);

        return id;
    }

    get(id: UUID): Promise<Restaurant | null> {
        return this.getValidRestaurant(id);
    }

    list(query?: RestaurantSearchDto): Promise<Pagination<Restaurant>> {
        const { success, error, data } = RestaurantSearchSchema.safeParse(query);

        if (!success) {
            throw BadRequestError(formatZodError(error));
        }

        return this.repository.list(data);
    }

    async update(id: UUID, payload: RestaurantUpdateDto): Promise<boolean> {
        await this.getValidRestaurant(id);
        return this.repository.update(id, payload);
    }

    async delete(id: UUID): Promise<boolean> {
        await this.getValidRestaurant(id);
        return this.repository.delete(id);
    }

    private async getValidRestaurant(id: UUID): Promise<Restaurant> {
        const restaurant = await this.repository.get(id);

        if (!restaurant || restaurant.status === STATUS.DELETED) {
            throw NotFoundError(`Restaurant with id ${id} not found`);
        }

        return restaurant;
    }
}
