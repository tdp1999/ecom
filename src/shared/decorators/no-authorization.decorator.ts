import { SetMetadata } from '@nestjs/common';
import { METADATA_NO_AUTHORIZATION } from '@shared/authorize/authorize.token';

export const NoAuthorization = () => SetMetadata(METADATA_NO_AUTHORIZATION, true);
