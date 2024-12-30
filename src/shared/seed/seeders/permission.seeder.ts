import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from '@permission/adapters/permission.entity';
import { PermissionItem } from '@shared/models/permission.model';
import { BRAND_PERMISSIONS } from '@shared/permissions/brand.permission';
import { CATEGORY_PERMISSIONS } from '@shared/permissions/category.permission';
import { PRODUCT_PERMISSIONS } from '@shared/permissions/product.permission';
import { ISeed } from '@shared/seed/seed.interface';
import { UserEntity } from '@user/adapters/repository/user.entity';
import { Repository } from 'typeorm';
import { v7 } from 'uuid';

@Injectable()
export class PermissionSeeder implements ISeed {
    private permissions: PermissionItem[] = [...PRODUCT_PERMISSIONS, ...CATEGORY_PERMISSIONS, ...BRAND_PERMISSIONS];

    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(PermissionEntity) private permissionRepository: Repository<PermissionEntity>,
    ) {}

    async seed(): Promise<void> {
        const rootUser = await this.userRepository.findOne({ where: { isSystem: true } });

        if (!rootUser) {
            throw new Error('Root user not found');
        }

        const currentTimestamp = BigInt(Date.now());

        const payload = this.permissions.map((permission) => {
            return this.permissionRepository.create({
                id: v7(),
                ...permission,
                createdAt: currentTimestamp,
                updatedAt: currentTimestamp,
                createdById: rootUser.id,
                updatedById: rootUser.id,
            });
        });

        await this.permissionRepository.save(payload);
    }

    async rerun(): Promise<void> {
        // Delete all permissions
        await this.permissionRepository.delete({});
        await this.seed();
    }
}
