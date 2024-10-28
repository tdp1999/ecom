import { Inject, Injectable, Optional } from '@nestjs/common';
import { BadRequestError, NotFoundError } from '@shared/errors/domain-error';
import { formatZodError } from '@shared/errors/error-formatter';
import { MODULE_IDENTIFIER } from '@shared/tokens/common.token';
import { UUID } from '@shared/types/general.type';
import { Pagination } from '@shared/types/pagination.type';
import { v7 } from 'uuid';
import {
    BrandCreateDto,
    BrandCreateSchema,
    BrandSearchDto,
    BrandSearchSchema,
    BrandUpdateDto,
    BrandUpdateSchema,
} from '../model/brand.dto';
import { Brand } from '../model/brand.model';
import { BRAND_REPOSITORY_TOKEN, IBrandRepository } from '../ports/brand-repository.interface';
import { IBrandService } from '../ports/brand-service.interface';

@Injectable()
export class BrandService implements IBrandService {
    constructor(
        @Optional() @Inject(MODULE_IDENTIFIER) private readonly moduleName: string = '',
        @Inject(BRAND_REPOSITORY_TOKEN) private readonly repository: IBrandRepository,
    ) {}

    list(query?: BrandSearchDto): Promise<Brand[]> {
        const { success, error, data } = BrandSearchSchema.safeParse(query);

        if (!success) {
            throw BadRequestError(formatZodError(error));
        }

        return this.repository.list(data);
    }

    paginatedList(query?: BrandSearchDto): Promise<Pagination<Brand>> {
        const { success, error, data } = BrandSearchSchema.safeParse(query);

        if (!success) {
            throw BadRequestError(formatZodError(error));
        }

        return this.repository.paginatedList(data);
    }

    get(id: UUID): Promise<Brand | null> {
        return this.getValidData(id);
    }

    async create(payload: BrandCreateDto): Promise<UUID> {
        const { success, error, data } = BrandCreateSchema.safeParse(payload);

        if (!success) {
            throw BadRequestError(formatZodError(error));
        }

        const id = v7();
        const currentTimestamp = BigInt(Date.now());
        const category: Brand = {
            id,
            ...data,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        };

        await this.repository.create(category);

        return id;
    }

    async update(id: UUID, payload: BrandUpdateDto): Promise<boolean> {
        const { success, error, data } = BrandUpdateSchema.safeParse(payload);

        if (!success) {
            throw BadRequestError(formatZodError(error));
        }

        await this.getValidData(id);
        return this.repository.update(id, data);
    }

    async delete(id: UUID, isHardDelete?: boolean): Promise<boolean> {
        await this.getValidData(id);

        if (isHardDelete) {
            return this.repository.delete(id);
        }

        return this.repository.update(id, { deletedAt: BigInt(Date.now()) });
    }

    private async getValidData(id: UUID): Promise<Brand> {
        const data = await this.repository.findById(id);

        if (!data || !!data.deletedAt) throw NotFoundError(`${this.moduleName} with id ${id} not found`);

        return data;
    }
}
