import { Injectable } from '@nestjs/common';
import { InternalServerError } from '@shared/errors/domain-error';
import { UUID } from '@shared/types/general.type';
import { BaseCacheService } from './cache.base';
import { CacheOptions, CacheRepository, CacheResult, Identifiable } from './cache.interface';

export interface MemoryCacheEntry<T> {
    value: T | null;
    timestamp: number;
}

@Injectable()
export class MemoryCacheService<T extends Identifiable> extends BaseCacheService<T> {
    private cache: Map<string, MemoryCacheEntry<T>> = new Map();

    constructor(
        private repository: CacheRepository<T>,
        private options?: CacheOptions,
    ) {
        super(options);
    }

    async hasItem(id: UUID): Promise<boolean> {
        return Promise.resolve(this.cache.has(this.formatKey(id)));
    }

    async getItem(id: UUID): Promise<T | null> {
        const key = this.formatKey(id);
        const entry = this.cache.get(key);

        if (entry) {
            return entry.value;
        }

        const item = await this.repository.findById(id);
        this.cache.set(key, { value: item, timestamp: Date.now() });
        return item;
    }

    async getItems(ids: UUID[]): Promise<CacheResult<T>> {
        const uniqueIds = [...new Set(ids)];
        const now = Date.now();
        const { cachedIds, uncachedIds } = this.separateIds(uniqueIds, now);

        // const cachedItems = cachedIds.map((id) => this.cache.get(this.formatKey(id))!.value);
        const cachedItems = new Map(cachedIds.map((id) => [id, this.cache.get(this.formatKey(id))!.value]));

        if (uncachedIds.length === 0) {
            return this.reorderResults(ids, cachedItems);
        }

        const newItems = await this.batchFetch(uncachedIds);
        this.cacheItems(newItems, now);

        const mergedMap = new Map([...cachedItems, ...newItems]);
        return this.reorderResults(ids, mergedMap);
    }

    async clearCache(): Promise<void> {
        this.cache.clear();
    }

    async preloadCache(items: T[]): Promise<void> {
        const now = Date.now();
        this.cacheItems(items, now);
    }

    async getCacheSize(): Promise<number> {
        return this.cache.size;
    }

    private separateIds(ids: UUID[], now: number) {
        const cachedIds: UUID[] = [];
        const uncachedIds: UUID[] = [];

        ids.forEach((id) => {
            const cached = this.cache.get(this.formatKey(id));
            if (cached && now - cached.timestamp < this.ttlMs) {
                cachedIds.push(id);
                return;
            }
            uncachedIds.push(id);
        });

        return { cachedIds, uncachedIds };
    }

    private async batchFetch(ids: UUID[]) {
        const items = await this.repository.findByIds(ids);
        const result = new Map<UUID, T | null>();

        ids.forEach((id) => result.set(id, null));
        items.forEach((item) => result.set(item.id, item));

        return result;
    }

    private cacheItems(items: T[], timestamp: number): void;
    private cacheItems(items: Map<UUID, T | null>, timestamp: number): void;
    private cacheItems(items: T[] | Map<UUID, T | null>, timestamp: number): void {
        const itemMap = items instanceof Map ? items : new Map(items.map((item) => [item.id, item]));

        if (itemMap.size > this.maxSize)
            throw InternalServerError(`Too many items to cache: ${itemMap.size} exceeds max size ${this.maxSize}`);

        let surplus = this.cache.size + itemMap.size - this.maxSize;

        while (surplus > 0) {
            const oldestKey = this.findOldestCacheEntry();
            if (oldestKey) {
                this.cache.delete(oldestKey);
                surplus--;
            }
        }
        for (const [key, value] of itemMap) {
            this.cache.set(this.formatKey(key), { value, timestamp });
        }
    }

    private findOldestCacheEntry(): string | undefined {
        let oldestKey: string | undefined;
        let oldestTimestamp = Infinity;

        for (const [key, item] of this.cache.entries()) {
            if (item.timestamp < oldestTimestamp) {
                oldestTimestamp = item.timestamp;
                oldestKey = key;
            }
        }

        return oldestKey;
    }
}
