import { FindOptionsWhere, ILike, IsNull } from 'typeorm';
import { SearchDto } from '../dtos/seach.dto';

export function whereBuilder<T extends SearchDto>(filters: Partial<T> = {}): FindOptionsWhere<T> {
    const where: FindOptionsWhere<T> = {
        deletedAt: IsNull(),
    } as unknown as FindOptionsWhere<T>;

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            // Fuzzy search for string values, exact match for others
            where[key as keyof T] = typeof value === 'string' ? ILike(`%${value}%`) : (value as any);
        }
    });

    return where;
}
