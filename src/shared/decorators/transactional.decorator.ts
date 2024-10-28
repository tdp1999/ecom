import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionManager {
    constructor(private readonly dataSource: DataSource) {}

    async executeInTransaction<T>(operation: () => Promise<T>): Promise<T> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await operation();
            await queryRunner.commitTransaction();
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}

export function Transactional() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const transactionManager = this.transactionManager as TransactionManager;
            return transactionManager.executeInTransaction(() => originalMethod.apply(this, args));
        };
        return descriptor;
    };
}
