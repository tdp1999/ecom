import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

// Only for the sake of studying builder pattern. This is overkill
export class WhereBuilder<Entity extends ObjectLiteral> {
    private constructor(
        private qb: SelectQueryBuilder<Entity>,
        private alias: string,
    ) {}

    public static create<Entity extends ObjectLiteral>(qb: SelectQueryBuilder<Entity>, alias: string = 'entity') {
        return new WhereBuilder(qb.where(`${alias}.deletedAt IS NULL`), alias);
    }

    public like(column: keyof Entity, value?: string): this {
        if (!value) return this;
        this.qb.andWhere(`${this.alias}.${String(column)} LIKE :value`, { value: `%${value}%` });
        return this;
    }

    public orLike(columns: (keyof Entity)[], keyword?: string): this {
        if (!keyword) return this;
        const conditions = columns.map((column) => `${this.alias}.${String(column)} LIKE :value`).join(' OR ');
        this.qb.andWhere(conditions, { value: `%${keyword}%` });
        return this;
    }

    public equal(column: keyof Entity, value?: any): this {
        if (!value) return this;
        this.qb.andWhere(`${this.alias}.${String(column)} = :value`, { value });
        return this;
    }

    public notEqual(column: keyof Entity, value?: any): this {
        if (!value) return this;
        this.qb.andWhere(`${this.alias}.${String(column)} != :value`, { value });
        return this;
    }

    public in(column: keyof Entity, values?: any[]): this {
        if (!values) return this;
        this.qb.andWhere(`${this.alias}.${String(column)} IN (:...values)`, { values });
        return this;
    }

    public notIn(column: keyof Entity, values?: any[]): this {
        if (!values) return this;
        this.qb.andWhere(`${this.alias}.${String(column)} NOT IN (:...values)`, { values });
        return this;
    }

    public apply(filters: Partial<Entity>): this {
        Object.entries(filters).forEach(([key, value]) => {
            if (value === undefined || value === null) return;

            if (typeof value === 'string') {
                this.like(key as keyof Entity, value);
            } else {
                this.equal(key as keyof Entity, value);
            }
        });
        return this;
    }

    public build(): SelectQueryBuilder<Entity> {
        return this.qb;
    }
}
