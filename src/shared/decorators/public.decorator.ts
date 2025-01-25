import { SetMetadata } from '@nestjs/common';
import { METADATA_PUBLIC, METADATA_REQUIRE_NO_AUTH } from '@shared/authenticate/authenticate.token';

export const Public = () => SetMetadata(METADATA_PUBLIC, true);
export const RequireNoAuth = () => SetMetadata(METADATA_REQUIRE_NO_AUTH, true);
