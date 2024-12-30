import { BaseEntityInterface } from '@shared/abstractions/entity.base';
import { Inject, Optional } from '@nestjs/common';
import { MODULE_IDENTIFIER } from '@shared/tokens/common.token';
import { SearchDto } from '@shared/dtos/seach.dto';
import { SharedUser } from '@shared/types/user.shared.type';
import { ZodError, ZodSchema } from 'zod';
import { Pagination } from '@shared/types/pagination.type';
import { BadRequestError, NotFoundError } from '@shared/errors/domain-error';
import { v7 } from 'uuid';
import { formatZodError } from '@shared/errors/error-formatter';
import { UUID } from '@shared/types/general.type';
import { DeepPartial } from 'typeorm';

export abstract class BaseCrudService<
    T extends BaseEntityInterface,
    C extends DeepPartial<T>,
    U extends DeepPartial<T>,
    S extends SearchDto,
> {
    protected constructor(
        @Optional() @Inject(MODULE_IDENTIFIER) protected readonly moduleName: string = '',
        // protected readonly repository: BaseCrudRepository<T, C, U, S>,
        protected readonly repository: any, // TODO: implement repository type
    ) {}

    protected abstract readonly createSchema: ZodSchema;
    protected abstract readonly updateSchema: ZodSchema;
    protected abstract readonly searchSchema: ZodSchema;

    protected visibleColumns: (keyof T)[] | undefined = undefined;

    async list(query?: S): Promise<T[]> {
        const { success, error, data } = this.searchSchema.safeParse(query);

        if (!success) {
            throw this.handleValidationError(error);
        }

        console.log('this.visibleColumns', this.visibleColumns);

        return this.repository.list(data, this.visibleColumns);
    }

    async paginatedList(query?: S): Promise<Pagination<T>> {
        const { success, error, data } = this.searchSchema.safeParse(query);

        if (!success) throw this.handleValidationError(error);

        return this.repository.paginatedList(data, this.visibleColumns);
    }

    async get(id: string): Promise<T | null> {
        return await this.getValidData(id);
    }

    exist(id: UUID): Promise<boolean> {
        return this.repository.exist(id);
    }

    existAndValid(id: UUID): Promise<boolean> {
        return this.repository.existAndNotDeleted(id);
    }

    async create(user: SharedUser, payload: C): Promise<string> {
        const { success, error, data } = this.createSchema.safeParse(payload);

        if (!success) {
            throw this.handleValidationError(error);
        }

        await this.validateCreate(data);

        const id = v7();
        const currentTimestamp = BigInt(Date.now());

        const entity: T = {
            id,
            ...data,
            createdAt: currentTimestamp,
            createdById: user.id,
            updatedAt: currentTimestamp,
            updatedById: user.id,
        };

        await this.repository.create(entity as unknown as C);

        return id;
    }

    async update(user: SharedUser, id: UUID, payload: U): Promise<boolean> {
        const { success, error, data } = this.updateSchema.safeParse(payload);

        if (!success) {
            throw this.handleValidationError(error);
        }

        const isExisted = await this.repository.exist(id);
        if (!isExisted) {
            throw NotFoundError(`${this.moduleName} with id ${id} not found`);
        }

        await this.validateUpdate(id, data);

        return this.repository.update(id, { ...data, updatedById: user.id });
    }

    async delete(user: SharedUser, id: string, isHardDelete?: boolean): Promise<boolean> {
        await this.getValidData(id);

        if (isHardDelete) {
            return this.repository.delete(id);
        }

        return this.repository.update(id, { deletedAt: BigInt(Date.now()), deletedById: user.id } as U);
    }

    protected async getValidData(id: string): Promise<T> {
        const data = await this.repository.findById(id, this.visibleColumns);

        if (!data || !!data.deletedAt) {
            throw NotFoundError(`${this.moduleName} with id ${id} not found`);
        }

        return data;
    }

    protected handleValidationError(error: ZodError) {
        return BadRequestError(formatZodError(error));
    }

    // Override these methods in concrete services if needed
    protected abstract validateCreate(data: C): Promise<void>;

    protected abstract validateUpdate(id: string, data: U): Promise<void>;
}
