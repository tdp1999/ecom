import { SetMetadata } from '@nestjs/common';
import { METADATA_AUTHORIZATION } from '@shared/authorize/authorize.token';
import { PermissionSlugAggregate } from '@shared/types/permission.type';

export const Authorization = (slug: PermissionSlugAggregate) => SetMetadata(METADATA_AUTHORIZATION, slug);
