import { SetMetadata } from '@nestjs/common';
import { METADATA_PUBLIC } from '@shared/authenticate/authenticate.token';

export const Public = () => SetMetadata(METADATA_PUBLIC, true);
