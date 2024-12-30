import { SearchDto } from '@shared/dtos/seach.dto';
import { DeepPartial, FindOptionsOrder, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
import { Pagination } from '@shared/types/pagination.type';
import { ORDER_TYPE } from '@shared/enums/status.enum';

export abstract class BaseCrudRepository<
    T extends ObjectLiteral,
    C extends DeepPartial<T>,
    U extends DeepPartial<T>,
    S extends SearchDto,
> {
    protected constructor(protected readonly repository: Repository<T>) {}

    async list(query?: S, visibleColumns?: (keyof T)[]): Promise<T[]> {
        const { orderBy, orderType } = query || {};
        return await this.repository.find({
            ...(visibleColumns && visibleColumns.length && { select: visibleColumns }),
            where: this.buildWhereConditions(query),
            order: this.buildOrderConditions(orderBy, orderType),
        });
    }

    async paginatedList(query?: S, visibleColumns?: (keyof T)[]): Promise<Pagination<T>> {
        const { limit = 10, page = 1, orderBy, orderType } = query || {};

        const [items, total] = await this.repository.findAndCount({
            ...(visibleColumns && visibleColumns.length && { select: visibleColumns }),
            where: this.buildWhereConditions(query),
            take: limit,
            skip: (page - 1) * limit,
            order: this.buildOrderConditions(orderBy, orderType),
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

    async exist(id: string): Promise<boolean> {
        const result = await this.repository
            .createQueryBuilder('entity')
            .where('entity.id = :id', { id })
            .select('1') // Only return '1' instead of fetching fields
            .getRawOne();

        return !!result;
    }

    async existAndNotDeleted(id: string): Promise<boolean> {
        const result = await this.repository
            .createQueryBuilder('entity')
            .where('entity.id = :id', { id })
            .andWhere('entity.deletedAt IS NULL')
            .select('1') // Only return '1' instead of fetching fields
            .getRawOne();

        return !!result;
    }

    async findById(id: string, visibleColumns?: (keyof T)[]): Promise<T | null> {
        return await this.repository.findOne({
            where: { id },
            ...(visibleColumns && visibleColumns.length && { select: visibleColumns }),
        } as any);
    }

    async create(data: C): Promise<boolean> {
        const entity = this.repository.create(data as any);
        await this.repository.save(entity);
        return true;
    }

    async update(id: string, data: U): Promise<boolean> {
        await this.repository.update(id, data as any);
        return true;
    }

    async delete(id: string): Promise<boolean> {
        await this.repository.delete(id);
        return true;
    }

    protected buildOrderConditions(orderBy?: string, orderType?: ORDER_TYPE): FindOptionsOrder<T> {
        if (!orderBy || !orderType) {
            return {};
        }

        return { [orderBy]: orderType.toUpperCase() as ORDER_TYPE } as FindOptionsOrder<T>;
    }

    protected abstract buildWhereConditions(query?: S): FindOptionsWhere<T>;
}
