import { CacheOptions, CacheRepository, CacheService, Identifiable } from '@shared/cache/cache.interface';
import { MemoryCacheService } from '@shared/cache/memory-cache.service';
import { RedisCacheService } from '@shared/cache/redis-cache.service';

export class CacheFactory {
    static createCacheService<T extends Identifiable>(
        type: 'memory' | 'redis',
        repository: CacheRepository<T>,
        options: CacheOptions = {},
        // redis?: Redis,
    ): CacheService<T> {
        switch (type) {
            case 'memory':
                return new MemoryCacheService<T>(repository, options);
            case 'redis':
                // if (!redis) {
                //     throw new Error('Redis client is required for redis cache service');
                // }
                return new RedisCacheService<T>(repository, options);
            default:
                throw new Error(`Unsupported cache type: ${type}`);
        }
    }
}
