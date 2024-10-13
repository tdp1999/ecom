import { Inject } from '@nestjs/common';
import { DomainError } from '@shared/errors/domain-error';
import { formatZodError } from '@shared/errors/error-formatter';
import { UUID } from '@shared/types/general.type';
import { v7 } from 'uuid';
import { RESTAURANT_ERROR_CODES } from '../errors/restaurant.error';
import { RestaurantCreateDto, RestaurantCreateSchema, RestaurantUpdateDto } from '../model/restaurant.dto';
import { Restaurant } from '../model/restaurant.model';
import { IRestaurantService } from '../ports/inbound/restaurant-inbound.interface';
import { IRestaurantRepository, RESTAURANT_REPOSITORY_TOKEN } from '../ports/outbound/restaurant-outbound.interface';

export class RestaurantService implements IRestaurantService {
    constructor(@Inject(RESTAURANT_REPOSITORY_TOKEN) private readonly repository: IRestaurantRepository) {}

    async create(payload: RestaurantCreateDto): Promise<UUID> {
        const { success, error, data } = RestaurantCreateSchema.safeParse(payload);

        if (!success) {
            throw new DomainError({
                errorCode: RESTAURANT_ERROR_CODES.E_RESTAURANT_01,
                error: 'Bad Request',
                message: formatZodError(error),
            });
        }

        const id = v7();
        const currentTimestamp = BigInt(Date.now());
        const restaurant: Restaurant = { id, ...data, createdAt: currentTimestamp, updatedAt: currentTimestamp };
        await this.repository.create(restaurant);

        return id;
    }

    get(id: UUID): Promise<Restaurant | null> {
        return this.repository.get(id);
    }

    list(): Promise<Restaurant[]> {
        return this.repository.list();
    }

    update(id: UUID, payload: RestaurantUpdateDto): Promise<boolean> {
        return this.repository.update(id, payload);
    }

    delete(id: UUID): Promise<boolean> {
        return this.repository.delete(id);
    }
}
