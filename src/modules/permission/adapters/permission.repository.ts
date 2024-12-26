import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudRepository } from '@shared/abstractions/repository.base';
import { Permission } from '@shared/models/permission.model';
import { FindOptionsWhere, ILike, IsNull, Repository } from 'typeorm';
import { IPermissionRepository } from '../domain/permission-repository.interface';
import { PermissionCreateDto, PermissionSearchDto, PermissionUpdateDto } from '../domain/permission.dto';
import { PermissionEntity } from './permission.entity';

@Injectable()
export class PermissionRepository
    extends BaseCrudRepository<PermissionEntity, PermissionCreateDto, PermissionUpdateDto, PermissionSearchDto>
    implements IPermissionRepository
{
    constructor(@InjectRepository(PermissionEntity) protected repository: Repository<PermissionEntity>) {
        super(repository);
    }

    protected buildWhereConditions(query?: PermissionSearchDto): FindOptionsWhere<PermissionEntity> {
        const { ...filters } = query || {};

        // Build search conditions dynamically
        const where: FindOptionsWhere<Permission> = {
            deletedAt: IsNull(),
        };

        if (filters.name) {
            where.name = ILike(`%${filters.name}%`); // Fuzzy search
        }

        if (filters.action) {
            where.action = ILike(`%${filters.action}%`); // Fuzzy search
        }

        if (filters.resource) {
            where.resource = ILike(`%${filters.resource}%`); // Fuzzy search
        }

        if (filters.slug) {
            where.slug = ILike(`%${filters.slug}%`); // Fuzzy search
        }

        return where;
    }
}
