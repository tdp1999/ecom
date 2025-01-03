import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from '@shared/types/general.type';
import { Pagination } from '@shared/types/pagination.type';
import { FindOptionsWhere, ILike, In, IsNull, TreeRepository } from 'typeorm';
import { CategoryCreateDto, CategorySearchDto, CategoryUpdateDto } from '../../domain/model/category.dto';
import { Category } from '../../domain/model/category.model';
import { ICategoryRepository } from '../../domain/ports/category-repository.interface';
import { CategoryEntity } from './category.entity';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
    constructor(@InjectRepository(CategoryEntity) private repository: TreeRepository<CategoryEntity>) {}

    /* Query */
    async list(query?: CategorySearchDto, visibleColumns?: (keyof Category)[]): Promise<Category[]> {
        const { orderBy, orderType } = query || {};

        return await this.repository.find({
            ...(visibleColumns && visibleColumns.length && { select: visibleColumns }),
            where: this.buildWhereConditions(query),
            order: this.buildOrderConditions({ orderBy, orderType }),
        });
    }

    async paginatedList(query?: CategorySearchDto, visibleColumns?: (keyof Category)[]): Promise<Pagination<Category>> {
        const { limit = 10, page = 1, orderBy, orderType } = query || {};

        const [items, total] = await this.repository.findAndCount({
            ...(visibleColumns && visibleColumns.length && { select: visibleColumns }),
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

    async getFullTree(visibleColumns?: (keyof Category)[]): Promise<Category[]> {
        const queryBuilder = this.repository.createQueryBuilder('category').where('category.deletedAt IS NULL');
        if (visibleColumns?.length) {
            queryBuilder.select(visibleColumns.map((col) => `category.${col}`));
        } else {
            queryBuilder.select();
        }

        const categories = await queryBuilder.getMany();
        return this.buildTree(categories);
    }

    async findById(id: UUID, visibleColumns?: (keyof Category)[]): Promise<Category | null> {
        return await this.repository.findOne({
            where: { id },
            ...(visibleColumns && visibleColumns.length && { select: visibleColumns }),
        });
    }

    async findByIds(ids: UUID[], visibleColumns?: (keyof Category)[]): Promise<Category[]> {
        const selectedColumns = visibleColumns || ['id', 'name'];
        return await this.repository.find({ where: { id: In(ids) }, select: selectedColumns });
    }

    async exist(id: UUID): Promise<boolean> {
        const result = await this.repository
            .createQueryBuilder('entity')
            .where('entity.id = :id', { id })
            .select('1')
            .getRawOne();

        return !!result;
    }

    async existAndNotDeleted(id: UUID): Promise<boolean> {
        const result = await this.repository
            .createQueryBuilder('entity')
            .where('entity.id = :id', { id })
            .andWhere('entity.deletedAt IS NULL')
            .select('1')
            .getRawOne();

        return !!result;
    }

    async hasChildren(category: CategoryEntity): Promise<boolean> {
        const count = await this.repository.countDescendants(category);

        // The count includes the category itself, so we need to subtract 1
        return count - 1 > 0;
    }

    async getFullTreeOfAncestor(id: UUID, visibleColumns?: (keyof Category)[]): Promise<Category | null> {
        const category = await this.repository.findOne({
            where: { id },
            ...(visibleColumns && visibleColumns.length && { select: visibleColumns }),
        });

        if (!category) {
            return null;
        }

        return this.repository.findDescendantsTree(category);
    }

    private buildWhereConditions(query?: CategorySearchDto) {
        const { ...filters } = query || {};

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

            // All the logical bugs should be caught in the service layer
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
