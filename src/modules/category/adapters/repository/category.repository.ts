import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactional, TransactionManager } from '@shared/decorators/transactional.decorator';
import { UUID } from '@shared/types/general.type';
import { Pagination } from '@shared/types/pagination.type';
import { DataSource, FindOptionsWhere, ILike, IsNull, TreeRepository } from 'typeorm';
import { CategoryCreateDto, CategorySearchDto, CategoryUpdateDto } from '../../domain/model/category.dto';
import { Category } from '../../domain/model/category.model';
import { ICategoryRepository } from '../../domain/ports/category-repository.interface';
import { CategoryEntity } from './category.entity';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
    constructor(@InjectRepository(CategoryEntity) private repository: TreeRepository<CategoryEntity>) {}

    /* Query */
    async list(query?: CategorySearchDto): Promise<Category[]> {
        const { orderBy, orderType } = query || {};
        const items = await this.repository.find({
            where: this.buildWhereConditions(query),
            order: this.buildOrderConditions({ orderBy, orderType }),
        });
        return items;
    }

    async paginatedList(query?: CategorySearchDto): Promise<Pagination<Category>> {
        const { limit = 10, page = 1, orderBy, orderType } = query || {};

        const [items, total] = await this.repository.findAndCount({
            where: this.buildWhereConditions(query),
            take: limit,
            skip: (page - 1) * limit,
            order: this.buildOrderConditions({ orderBy, orderType }),
        });

        const totalPages = Math.ceil(total / limit);

        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    }

    async getFullTree(): Promise<Category[]> {
        const categories = await this.repository
            .createQueryBuilder('category')
            .where('category.deletedAt IS NULL')
            .getMany();

        return this.buildTree(categories);
    }

    async findById(id: UUID): Promise<Category | null> {
        const category = await this.repository.findOneBy({ id });
        return category;
    }

    async hasChildren(category: CategoryEntity): Promise<boolean> {
        const count = await this.repository.countDescendants(category);

        return count > 0;
    }

    async getFullTreeOfAncestor(id: UUID): Promise<Category | null> {
        const category = await this.repository.findOneBy({ id });

        if (!category) {
            return null;
        }

        return this.repository.findDescendantsTree(category);
    }

    private buildWhereConditions(query?: CategorySearchDto) {
        const { limit = 10, page = 1, ...filters } = query || {};

        // Build search conditions dynamically
        const where: FindOptionsWhere<Category> = {
            deletedAt: IsNull(),
        };

        if (filters.name) {
            where.name = ILike(`%${filters.name}%`); // Fuzzy search
        }

        if (filters.status) {
            where.status = filters.status;
        }

        return where;
    }

    private buildOrderConditions(query?: CategorySearchDto) {
        const { orderBy, orderType } = query || {};

        if (!orderBy || !orderType) {
            return {};
        }

        return {
            [orderBy]: orderType.toUpperCase() === 'ASC' ? 'ASC' : 'DESC', // Ensure correct order type
        };
    }

    private buildTree(categories: Category[]): Category[] {
        // Build a map of categories by ID for easy access
        const categoryMap: Map<string, Category> = new Map();
        categories.forEach((category) => categoryMap.set(category.id, { ...category, children: [] }));

        //Create the root array for the top-level nodes
        const rootCategories: Category[] = [];

        // Attach each category to its parent or add it to the root if it has no parent
        categories.forEach((category) => {
            const currentCategory = categoryMap.get(category.id);

            if (!currentCategory) return;

            if (category.parentId) {
                const parent = categoryMap.get(category.parentId);

                if (parent && Array.isArray(parent.children)) {
                    parent.children.push(currentCategory);
                }

                return;
            }

            rootCategories.push(currentCategory);
        });

        return rootCategories;
    }

    /* Command */
    async create(category: CategoryCreateDto, parentId?: UUID): Promise<boolean> {
        let parent: Category | null = null;

        if (parentId) {
            parent = await this.repository.findOneBy({ id: parentId });

            // All the logical bugs should be catched in the service layer
            if (!parent) {
                return false;
            }
        }

        // it is required to set the parent in the child entity and then save them
        await this.repository.create({ ...category, parent }).save();

        return true;
    }

    async update(id: UUID, data: CategoryUpdateDto): Promise<boolean> {
        await this.repository.save({ id, ...data });

        return true;
    }

    async delete(id: UUID): Promise<boolean> {
        await this.repository.delete({ id });
        return true;
    }
}
