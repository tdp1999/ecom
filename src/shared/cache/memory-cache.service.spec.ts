import { MemoryCacheService } from '@shared/cache/memory-cache.service';
import { UUID } from '@shared/types/general.type';
import { CacheFactory } from './cache.factory';
import { CacheRepository, CacheService, Identifiable } from './cache.interface';

interface TestUser extends Identifiable {
    id: UUID;
    name: string;
}

describe('MemoryCacheService', () => {
    let cacheService: CacheService<TestUser>;
    let mockRepository: jest.Mocked<CacheRepository<TestUser>>;

    const mockUsers: TestUser[] = [
        { id: '1', name: 'User 1' },
        { id: '2', name: 'User 2' },
        { id: '3', name: 'User 3' },
    ];

    beforeEach(async () => {
        // Create mock repository
        mockRepository = { findByIds: jest.fn() } as any;

        cacheService = CacheFactory.createCacheService('memory', mockRepository, {
            ttlMs: 1000, // 1 second for easier testing
            maxSize: 3,
            prefix: 'test',
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Basic Cache Operations', () => {
        it('should fetch and cache items on first request', async () => {
            // Setup
            mockRepository.findByIds.mockResolvedValue([mockUsers[0], mockUsers[1]]);

            // Execute
            const result = await cacheService.getItems(['1', '2']);

            // Verify
            expect(result).toHaveLength(2);
            expect(mockRepository.findByIds).toHaveBeenCalledTimes(1);

            // Second request should hit cache
            const secondResult = await cacheService.getItems(['1', '2']);
            expect(secondResult).toHaveLength(2);
            expect(mockRepository.findByIds).toHaveBeenCalledTimes(1); // No additional repository calls
        });

        it('should handle null values', async () => {
            mockRepository.findByIds.mockResolvedValue([mockUsers[0], mockUsers[2]]);

            const result = await cacheService.getItems(['1', '2', '3']);

            expect(result).toHaveLength(3);

            // Second request should still return the same results without repository call
            const secondResult = await cacheService.getItems(['1', '2', '3']);
            expect(secondResult).toHaveLength(3);
            expect(mockRepository.findByIds).toHaveBeenCalledTimes(1);
        });
    });

    describe('Cache Expiration', () => {
        it('should refresh expired cache entries', async () => {
            // Setup with short TTL
            const shortTtlService = new MemoryCacheService<TestUser>(mockRepository, { ttlMs: 100 });

            mockRepository.findByIds.mockResolvedValueOnce([mockUsers[0]]).mockResolvedValueOnce([mockUsers[0]]);

            // First request
            await shortTtlService.getItems(['1']);
            expect(mockRepository.findByIds).toHaveBeenCalledTimes(1);

            // Wait for cache to expire
            await new Promise((resolve) => setTimeout(resolve, 150));

            // Second request should fetch fresh data
            await shortTtlService.getItems(['1']);
            expect(mockRepository.findByIds).toHaveBeenCalledTimes(2);
        });
    });

    describe('Cache Size Management', () => {
        it('should respect maxSize and evict oldest entries', async () => {
            // Setup service with max size of 2
            const smallCacheService = new MemoryCacheService<TestUser>(mockRepository, { maxSize: 2 });

            mockRepository.findByIds
                .mockResolvedValueOnce([mockUsers[0]])
                .mockResolvedValueOnce([mockUsers[1]])
                .mockResolvedValueOnce([mockUsers[2]]);

            // Fill cache
            await smallCacheService.getItems(['1']);
            await smallCacheService.getItems(['2']);

            expect(await smallCacheService.getCacheSize()).toBe(2);

            // Add one more item
            await smallCacheService.getItems(['3']);

            // Verify the oldest item was evicted
            const result = await smallCacheService.hasItem('1');
            expect(result).toBeFalsy();
            expect(await smallCacheService.getCacheSize()).toBe(2);
        });
    });

    describe('Batch Operations', () => {
        it('should handle duplicate IDs in request', async () => {
            mockRepository.findByIds.mockResolvedValue([mockUsers[0]]);

            const result = await cacheService.getItems(['1', '1', '1']);

            expect(result).toHaveLength(3); // Should duplicate the result
            expect(mockRepository.findByIds).toHaveBeenCalledTimes(1);
            expect(mockRepository.findByIds).toHaveBeenCalledWith(['1']); // Should deduplicate the request
        });

        it('should combine cached and uncached items efficiently', async () => {
            // First request to cache some items
            mockRepository.findByIds.mockResolvedValueOnce([mockUsers[0], mockUsers[1]]);
            await cacheService.getItems(['1', '2']);

            // Reset mock for next request
            mockRepository.findByIds.mockResolvedValueOnce([mockUsers[2]]);

            // Request mix of cached and uncached items
            const result = await cacheService.getItems(['1', '2', '3']);

            expect(result).toHaveLength(3);
            expect(mockRepository.findByIds).toHaveBeenCalledTimes(2);
            expect(mockRepository.findByIds).toHaveBeenLastCalledWith(['3']); // Should only fetch uncached
        });
    });

    describe('Error Handling', () => {
        it('should handle repository errors gracefully', async () => {
            mockRepository.findByIds.mockRejectedValue(new Error('DB Error'));

            await expect(cacheService.getItems(['1'])).rejects.toThrow('DB Error');

            // Cache should not contain failed items
            expect(await cacheService.getCacheSize()).toBe(0);
        });
    });

    describe('Cache Preloading', () => {
        it('should preload cache correctly', async () => {
            await cacheService.preloadCache([mockUsers[0], mockUsers[1]]);

            const result = await cacheService.getItems(['1', '2']);

            expect(result.length).toHaveLength(2);
            expect(mockRepository.findByIds).not.toHaveBeenCalled();
        });
    });
});

// Example of integration test with actual repository
// describe('MemoryCacheService Integration', () => {
//     let cacheService: MemoryCacheService<TestUser>;
//     let repository: Repository<TestUser>;
//
//     beforeAll(async () => {
//         // Setup your TypeORM connection and repository here
//     });
//
//     beforeEach(() => {
//         cacheService = new MemoryCacheService<TestUser>(repository, {
//             ttlMs: 1000,
//             maxSize: 100,
//             cacheNulls: true,
//         });
//     });
//
//     it('should work with real database operations', async () => {
//         // Create test users
//         const user1 = await repository.save({ name: 'Test User 1' });
//         const user2 = await repository.save({ name: 'Test User 2' });
//
//         // Test cache operations
//         const result1 = await cacheService.getItems([user1.id, user2.id]);
//         expect(result1.found).toHaveLength(2);
//
//         // Update a user
//         await repository.update(user1.id, { name: 'Updated User 1' });
//
//         // Cache should still return old value
//         const result2 = await cacheService.getItems([user1.id]);
//         expect(result2.found[0].name).toBe('Test User 1');
//
//         // Clear cache and fetch again
//         await cacheService.clearCache();
//         const result3 = await cacheService.getItems([user1.id]);
//         expect(result3.found[0].name).toBe('Updated User 1');
//     });
// });
