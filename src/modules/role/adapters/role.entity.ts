import { BaseEntity } from '@shared/abstractions/entity.base';
import { Role } from '@shared/models/role.model';
import { Column, Entity } from 'typeorm';

@Entity('roles')
export class RoleEntity extends BaseEntity implements Role {
    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string | null;

    @Column({ type: 'json', nullable: true })
    permissionIds: string[];
}
