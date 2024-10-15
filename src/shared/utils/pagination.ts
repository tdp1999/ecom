import { Pagination } from '../types/pagination.type';

export async function paginate<T>(
    items: T[],
    totalItems: number,
    page: number = 1,
    limit: number = 10,
): Promise<Pagination<T>> {
    const totalPages = Math.ceil(totalItems / limit);

    return {
        items,
        meta: {
            total: totalItems,
            page,
            limit,
            totalPages,
        },
    };
}
