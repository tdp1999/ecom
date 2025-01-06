import { BrandPermission } from '@shared/permissions/brand.permission';
import { CategoryPermission } from '@shared/permissions/category.permission';
import { ProductPermission } from '@shared/permissions/product.permission';

export type PermissionSlugAggregate = BrandPermission | CategoryPermission | ProductPermission;
