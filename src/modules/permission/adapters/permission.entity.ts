import { BaseEntity } from '@shared/abstractions/entity.base';
import { Permission } from '@shared/models/permission.model';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

@Entity('permissions')
export class PermissionEntity extends BaseEntity implements Permission {
    @Column({ unique: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string | null;

    @Column()
    resource: string;

    @Column()
    action: string;

    @Column({ unique: true })
    slug: string;

    @BeforeInsert()
    @BeforeUpdate()
    buildSlugs() {
        this.slug = `${this.resource}:${this.action}`;
    }
}
