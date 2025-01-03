import { Injectable } from '@nestjs/common';
import { BaseCacheService } from '@shared/cache/cache.base';
import { CacheOptions, CacheRepository, Identifiable } from '@shared/cache/cache.interface';
import { UUID } from '@shared/types/general.type';

@Injectable()
export class RedisCacheService<T extends Identifiable> extends BaseCacheService<T> {
    constructor(
        private repository: CacheRepository<T>,
        private options?: CacheOptions,
    ) {
        super(options);
    }

    hasItem(id: UUID): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    getItems(ids: UUID[]): Promise<(T | null)[]> {
        throw new Error('Method not implemented.');
    }

    clearCache(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    preloadCache(items: T[]): Promise<void> {
        throw new Error('Method not implemented.');
    }

    getCacheSize(): Promise<number> {
        throw new Error('Method not implemented.');
    }
}
