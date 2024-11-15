import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class TransactionManager {
    constructor(private readonly dataSource: DataSource) {}

    async executeInTransaction<T>(operation: (entityManager: EntityManager) => Promise<T>): Promise<T> {
        return this.dataSource.transaction(async (manager) => {
            return operation(manager);
        });
    }
}

// Improved decorator that passes EntityManager
export function Transactional() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const transactionManager = this.transactionManager as TransactionManager;

            return transactionManager.executeInTransaction(async (manager: EntityManager) => {
                // Temporarily replace repositories with transaction-specific ones
                const originalRepositories = new Map();

                // Store original repositories and replace with transaction-specific ones
                for (const [key, value] of Object.entries(this)) {
                    if (value?.constructor?.name === 'Repository') {
                        originalRepositories.set(key, value);
                        this[key] = manager.getRepository((value as any).target);
                    }
                }

                try {
                    // Call the original method with transaction-specific repositories
                    return await originalMethod.apply(this, args);
                } finally {
                    // Restore original repositories
                    for (const [key, value] of originalRepositories) {
                        this[key] = value;
                    }
                }
            });
        };

        return descriptor;
    };
}
