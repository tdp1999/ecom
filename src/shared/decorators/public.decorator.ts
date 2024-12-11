import { SetMetadata } from '@nestjs/common';

export const METADATA_PUBLIC = Symbol('METADATA_PUBLIC');

export const Public = () => SetMetadata(METADATA_PUBLIC, true);
