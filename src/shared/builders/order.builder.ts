import { SearchDto } from '@shared/dtos/seach.dto';
import { ORDER_TYPE } from '@shared/enums/status.enum';
import { FindOptionsOrder, ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export function buildOrderConditions<T>(orderBy?: string, orderType?: ORDER_TYPE): FindOptionsOrder<T> {
    if (!orderBy || !orderType) {
        return {};
    }

    return { [orderBy]: orderType.toUpperCase() as ORDER_TYPE } as FindOptionsOrder<T>;
}

// Only for the sake of studying builder pattern. This is overkill
export class OrderBuilder<Entity extends ObjectLiteral> {
    private constructor(
        private qb: SelectQueryBuilder<Entity>,
        private alias: string,
        private readonly validColumns: Set<string> | null,
    ) {}

    public static create<Entity extends ObjectLiteral>(
        qb: SelectQueryBuilder<Entity>,
        alias: string,
        validColumns: string[] | null = null,
    ) {
        const newValidColumns = validColumns ? new Set(validColumns) : null;
        return new OrderBuilder(qb, alias, newValidColumns);
    }

    public orderBy(orderBy?: string, orderType: ORDER_TYPE = ORDER_TYPE.ASC): this {
        if (!orderBy) return this;
        if (this.validColumns && !this.validColumns.has(orderBy)) throw new Error(`${orderBy} is not a valid column`);
        this.qb.orderBy(`${this.alias}.${orderBy}`, orderType);
        return this;
    }

    public build() {
        return this.qb;
    }
}

export function withDefaultOrder<Entity extends ObjectLiteral>(
    qb: SelectQueryBuilder<Entity>,
    alias: string,
    query: SearchDto,
) {
    return OrderBuilder.create(qb, alias).orderBy(query.orderBy, query.orderType).build();
}
