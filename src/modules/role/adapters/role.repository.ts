import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudRepository } from '@shared/abstractions/repository.base';
import { Role } from '@shared/models/role.model';
import { FindOptionsWhere, ILike, IsNull, Repository } from 'typeorm';
import { IRoleRepository } from '../domain/role-repository.interface';
import { RoleCreateDto, RoleSearchDto, RoleUpdateDto } from '../domain/role.dto';
import { RoleEntity } from './role.entity';

@Injectable()
export class RoleRepository
    extends BaseCrudRepository<RoleEntity, RoleCreateDto, RoleUpdateDto, RoleSearchDto>
    implements IRoleRepository
{
    constructor(@InjectRepository(RoleEntity) protected repository: Repository<RoleEntity>) {
        super(repository);
    }

    protected buildWhereConditions(query?: RoleSearchDto): FindOptionsWhere<RoleEntity> {
        const { ...filters } = query || {};

        // Build search conditions dynamically
        const where: FindOptionsWhere<Role> = {
            deletedAt: IsNull(),
        };

        if (filters.name) {
            where.name = ILike(`%${filters.name}%`); // Fuzzy search
        }

        return where;
    }
}
