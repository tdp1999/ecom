import { SearchSchema } from '@shared/dtos/seach.dto';
import { z } from 'zod';
import {
    AddressCreateCommandSchema,
    AddressSchema,
    AddressUpdateCommandSchema,
    IAddress,
} from '../../domain/address.model';

export const AddressQuerySchema = SearchSchema.merge(
    AddressSchema.pick({ city: true, stateOrProvince: true, country: true, address1: true }).partial(),
);

export type AddressQueryDto = z.infer<typeof AddressQuerySchema>;
export type AddressViewDto = IAddress;
export type AddressCreateCommandDto = z.infer<typeof AddressCreateCommandSchema>;
export type AddressUpdateCommandDto = z.infer<typeof AddressUpdateCommandSchema>;
