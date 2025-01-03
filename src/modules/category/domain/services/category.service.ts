import { Inject, Injectable, Optional } from '@nestjs/common';
import { BadRequestError, NotFoundError } from '@shared/errors/domain-error';
import { formatZodError } from '@shared/errors/error-formatter';
import { MODULE_IDENTIFIER } from '@shared/tokens/common.token';
import { UUID } from '@shared/types/general.type';
import { Pagination } from '@shared/types/pagination.type';
import { SharedUser } from '@shared/types/user.shared.type';
import { v7 } from 'uuid';
import {
    CategoryCreateDto,
    CategoryCreateSchema,
    CategorySearchDto,
    CategorySearchSchema,
    CategoryUpdateDto,
    CategoryUpdateSchema,
} from '../model/category.dto';
import { ERR_CATEGORY_CHILDREN_NOT_EMPTY } from '../model/category.error';
import { Category } from '../model/category.model';
import { CATEGORY_REPOSITORY_TOKEN, ICategoryRepository } from '../ports/category-repository.interface';
import { ICategoryService } from '../ports/category-service.interface';

@Injectable()
export class CategoryService implements ICategoryService {
    private visibleFields: (keyof Category)[] = [
        // 'id',
        // 'name',
        // 'status',
        // 'isGroup',
        // 'isClickable',
        // 'parentId',
        // 'createdAt',
        // 'updatedAt',
        // 'deletedAt',
    ];

    constructor(
        @Optional() @Inject(MODULE_IDENTIFIER) private readonly moduleName: string = 'Category',
        @Inject(CATEGORY_REPOSITORY_TOKEN) private readonly repository: ICategoryRepository,
    ) {}

    list(query?: CategorySearchDto): Promise<Category[]> {
        const { success, error, data } = CategorySearchSchema.safeParse(query);

        if (!success) {
            throw BadRequestError(formatZodError(error));
        }

        return this.repository.list(data, this.visibleFields);
    }

    paginatedList(query?: CategorySearchDto): Promise<Pagination<Category>> {
        const { success, error, data } = CategorySearchSchema.safeParse(query);

        if (!success) {
            throw BadRequestError(formatZodError(error));
        }

        return this.repository.paginatedList(data, this.visibleFields);
    }

    getFullTree(): Promise<Category[]> {
        return this.repository.getFullTree(this.visibleFields);
    }

    get(id: UUID): Promise<Category | null> {
        return this.repository.getFullTreeOfAncestor(id, this.visibleFields);
    }

    exist(id: UUID): Promise<boolean> {
        return this.repository.exist(id);
    }

    existAndValid(id: UUID): Promise<boolean> {
        return this.repository.existAndNotDeleted(id);
    }

    async create(user: SharedUser, payload: CategoryCreateDto): Promise<UUID> {
        const { success, error, data } = CategoryCreateSchema.safeParse(payload);

        if (!success) {
            throw BadRequestError(formatZodError(error));
        }

        if (payload.ancestorId) {
            await this.getValidData(payload.ancestorId);
        }

        const id = v7();
        const currentTimestamp = BigInt(Date.now());
        const category: Category = {
            id,
            ...data,
            createdAt: currentTimestamp,
            createdById: user.id,
            updatedAt: currentTimestamp,
            updatedById: user.id,
        };

        await this.repository.create(category, payload.ancestorId);

        return id;
    }

    async update(user: SharedUser, id: UUID, payload: CategoryUpdateDto): Promise<boolean> {
        const { success, error, data } = CategoryUpdateSchema.safeParse(payload);

        if (!success) {
            throw BadRequestError(formatZodError(error));
        }

        // Prevent updating metadata if it's empty
        if (Object.keys(data).length === 1 && data.metadata && Object.keys(data.metadata).length < 1) {
            return false;
        }

        await this.getValidData(id);
        return this.repository.update(id, { ...data, updatedById: id } as Category);
    }

    async delete(user: SharedUser, id: UUID, isHardDelete?: boolean): Promise<boolean> {
        const data = await this.getValidData(id);

        // Prevent deleting if it has children
        if (await this.repository.hasChildren(data)) {
            throw BadRequestError(ERR_CATEGORY_CHILDREN_NOT_EMPTY.message);
        }

        if (isHardDelete) {
            return this.repository.delete(id);
        }

        return this.repository.update(id, { deletedAt: BigInt(Date.now()), deletedById: user.id });
    }

    private async getValidData(id: UUID): Promise<Category> {
        const data = await this.repository.findById(id, this.visibleFields);

        if (!data || !!data.deletedAt) throw NotFoundError(`${this.moduleName} with id ${id} not found`);

        return data;
    }
}
