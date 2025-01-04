import { UUID } from '@shared/types/general.type';

export interface Identifiable {
    id: UUID;
}

export interface CacheOptions {
    ttlMs?: number;
    prefix?: string;
    maxSize?: number;
}

export type CacheResult<T> = (T | null)[];

export interface CacheRepository<T extends Identifiable> {
    findById(id: UUID): Promise<T | null>;

    findByIds(ids: UUID[]): Promise<T[]>;
}

export interface CacheService<T extends Identifiable> {
    getItem(id: UUID): Promise<T | null>;

    getItems(ids: UUID[]): Promise<CacheResult<T>>;

    clearCache(): Promise<void>;

    preloadCache(items: T[]): Promise<void>;

    getCacheSize(): Promise<number>;
}
