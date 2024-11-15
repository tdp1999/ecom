import { ORDER_TYPE } from '@shared/enums/status.enum';
import { FindOptionsOrder } from 'typeorm';

export function buildOrderConditions<T>(orderBy?: string, orderType?: ORDER_TYPE): FindOptionsOrder<T> {
    if (!orderBy || !orderType) {
        return {};
    }

    return { [orderBy]: orderType.toUpperCase() as ORDER_TYPE } as FindOptionsOrder<T>;
}
