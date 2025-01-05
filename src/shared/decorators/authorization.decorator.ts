import { SetMetadata } from '@nestjs/common';
import { METADATA_AUTHORIZATION } from '@shared/authorize/authorize.token';

export const Authorization = (slug: string) => SetMetadata(METADATA_AUTHORIZATION, slug);
