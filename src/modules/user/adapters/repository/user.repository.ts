import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { buildOrderConditions } from '@shared/builders/order.builder';
import { Transactional, TransactionManager } from '@shared/decorators/transactional.decorator';
import { UUID } from '@shared/types/general.type';
import { Pagination } from '@shared/types/pagination.type';
import { ObjectUtils } from '@shared/utils/object.util';
import { FindOptionsWhere, ILike, In, IsNull, Repository } from 'typeorm';
import { UserCreateDto, UserSearchDto, UserUpdateDto } from '../../domain/model/user.dto';
import { User } from '../../domain/model/user.model';
import { IUserRepository } from '../../domain/ports/user-repository.interface';
import { UserProfileEntity } from './user-profile.entity';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(
        protected transactionManager: TransactionManager,
        @InjectRepository(UserEntity) protected repository: Repository<UserEntity>,
        @InjectRepository(UserProfileEntity) protected profileRepository: Repository<UserProfileEntity>,
    ) {}

    async list(query?: UserSearchDto, visibleColumns?: (keyof User)[]): Promise<User[]> {
        const { orderBy, orderType, ...filters } = query || {};

        return await this.repository.find({
            ...(visibleColumns && visibleColumns.length && { select: visibleColumns }),
            where: this.buildWhereConditions(filters),
            relations: ['profile'],
            order: buildOrderConditions<User>(orderBy, orderType),
        });
    }

    async paginatedList(query?: UserSearchDto, visibleColumns?: (keyof User)[]): Promise<Pagination<User>> {
        const { limit = 10, page = 1, orderBy, orderType } = query || {};

        const [items, total] = await this.repository.findAndCount({
            ...(visibleColumns && visibleColumns.length && { select: visibleColumns }),
            where: this.buildWhereConditions(query),
            relations: ['profile'],
            take: limit,
            skip: (page - 1) * limit,
            order: buildOrderConditions<User>(orderBy, orderType),
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

    async findById(id: UUID, visibleColumns?: (keyof User)[]): Promise<User | null> {
        return await this.repository.findOne({
            ...(visibleColumns && visibleColumns.length && { select: visibleColumns }),
            where: { id },
            relations: ['profile'],
        });
    }

    async findByIds(ids: UUID[], visibleColumns?: (keyof User)[]): Promise<User[]> {
        return await this.repository.find({
            where: { id: In(ids) },
            ...(visibleColumns && visibleColumns.length && { select: visibleColumns }),
        });
    }

    async getPassword(userId: UUID): Promise<string> {
        const user = await this.repository.findOne({ where: { id: userId }, select: ['password'] });

        if (!user) return '';

        return user.password;
    }

    async exist(id: UUID): Promise<boolean> {
        const result = await this.repository
            .createQueryBuilder('entity')
            .where('entity.id = :id', { id })
            .select('1') // Only return '1' instead of fetching fields
            .getRawOne();

        return !!result;
    }

    async existAndNotDeleted(id: UUID): Promise<boolean> {
        const result = await this.repository
            .createQueryBuilder('entity')
            .where('entity.id = :id', { id })
            .andWhere('entity.deletedAt IS NULL')
            .select('1') // Only return '1' instead of fetching fields
            .getRawOne();

        return !!result;
    }

    async findByConditions(conditions: Record<string, any>, visibleColumns?: (keyof User)[]): Promise<User | null> {
        const where = this.buildWhereConditions(conditions);
        return await this.repository.findOne({
            where,
            ...(visibleColumns && visibleColumns.length && { select: visibleColumns }),
        });
    }

    @Transactional()
    async create(data: UserCreateDto): Promise<boolean> {
        const { profile: profileData, ...userData } = data;
        const profile = this.profileRepository.create(profileData ?? {});
        const user = this.repository.create({ ...userData, profile });
        await user.save();
        return true;
    }

    @Transactional()
    async update(id: UUID, data: UserUpdateDto): Promise<boolean> {
        const user = await this.repository.findOne({
            where: { id },
            relations: ['profile'],
        });

        if (!user) return false;
        const profileId = user.profile.id;
        const { profile, ...userData } = data;

        if (profile && !ObjectUtils.isEmpty(profile)) {
            await this.profileRepository.update(profileId, profile ?? {});
        }

        if (!ObjectUtils.isEmpty(userData)) {
            await this.repository.update(id, userData);
        }

        return true;
    }

    async delete(id: UUID): Promise<boolean> {
        await this.repository.delete(id);
        return true;
    }

    private buildWhereConditions(query?: UserSearchDto) {
        const { ...filters } = query || {};

        // Build search conditions dynamically
        const where: FindOptionsWhere<Omit<User, 'profile'>> = {
            deletedAt: IsNull(),
        };

        if (filters.email) {
            where.email = ILike(`%${filters.email}%`); // Fuzzy search
        }

        if (filters.status) {
            where.status = filters.status;
        }

        return where;
    }
}
