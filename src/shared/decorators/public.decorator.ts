import { SetMetadata } from '@nestjs/common';
import { METADATA_PUBLIC } from '@shared/auth/auth.token';

export const Public = () => SetMetadata(METADATA_PUBLIC, true);
