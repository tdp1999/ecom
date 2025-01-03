import { CacheOptions, CacheResult, CacheService, Identifiable } from '@shared/cache/cache.interface';
import { UUID } from '@shared/types/general.type';

export abstract class BaseCacheService<T extends Identifiable> implements CacheService<T> {
    protected readonly ttlMs: number;
    protected readonly maxSize: number;
    protected readonly prefix: string;

    protected constructor(options: CacheOptions = {}) {
        this.ttlMs = options.ttlMs || 5 * 60 * 1000; // 5 minutes
        this.maxSize = options.maxSize || 1000;
        this.prefix = options.prefix || '';
    }

    abstract hasItem(id: UUID): Promise<boolean>;

    abstract getItems(ids: UUID[]): Promise<(T | null)[]>;

    abstract clearCache(): Promise<void>;

    abstract preloadCache(items: T[]): Promise<void>;

    abstract getCacheSize(): Promise<number>;

    // Common utility methods
    protected formatKey(id: string | number): string {
        return `${this.prefix}:${id}`;
    }

    protected reorderResults(originalIds: UUID[], items: Map<UUID, T | null>): CacheResult<T> {
        return originalIds.map((id) => items.get(id) ?? null);
    }
}
