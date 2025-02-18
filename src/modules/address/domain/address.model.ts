import { BadRequestError } from '@shared/errors/domain-error';
import { formatZodError } from '@shared/errors/error-formatter';
import { AuditableSchema, PersistenceToAuditableSchema } from '@shared/models/auditable.model';
import { UuidSchema } from '@shared/models/general-value-object.model';
import { BaseModel } from '@shared/models/model.base';
import { SharedUser } from '@shared/types/user.shared.type';
import { TemporalValue } from '@shared/vos/temporal.value';
import { v7 } from 'uuid';
import { z } from 'zod';
import { ERR_ADDRESS_LENGTH_EXCEEDED } from './address.error';
import { ADDRESS_TYPE } from './address.type';

export const AddressSchema = z.object({
    id: UuidSchema,
    // This might be become an id in the future
    country: z.string(),
    stateOrProvince: z.string(),
    city: z.string(),
    address1: z.string().max(200, ERR_ADDRESS_LENGTH_EXCEEDED.message),
    address2: z.string().max(200, ERR_ADDRESS_LENGTH_EXCEEDED.message).nullable().optional(),
    addressType: z.nativeEnum(ADDRESS_TYPE).optional().default(ADDRESS_TYPE.OTHER),
    remarks: z.string().nullable().optional(),

    // TODO: Add lat, long to address

    ...AuditableSchema.shape,
});

export const AddressCreateCommandSchema = AddressSchema.pick({
    country: true,
    stateOrProvince: true,
    city: true,
    address1: true,
    address2: true,
    addressType: true,
    remarks: true,
});

export const AddressUpdateCommandSchema = AddressSchema.omit({ id: true }).partial();

export interface IAddress extends z.infer<typeof AddressSchema> {}

export class Address extends BaseModel implements IAddress {
    readonly country: string;
    readonly stateOrProvince: string; // State, province, or region
    readonly city: string; // City or town
    readonly address1: string; // Street address
    readonly address2?: string; // Apartment, suite, unit, building, floor, etc.
    readonly addressType: ADDRESS_TYPE;
    readonly remarks?: string;

    private constructor(props: IAddress) {
        super(props);
        Object.assign(this, props);
    }

    // Static Creation Method, read this: https://refactoring.guru/design-patterns/factory-comparison (header 3)
    static fromJSON(rawAddress: unknown, user: SharedUser) {
        const { success, error, data } = AddressCreateCommandSchema.safeParse(rawAddress);

        if (!success)
            throw BadRequestError(formatZodError(error), { remarks: 'Constructing address from json failed' });

        const now = TemporalValue.getNow();

        return new Address({
            ...data,
            id: v7(),
            createdAt: now,
            createdById: user.id,
            updatedAt: now,
            updatedById: user.id,
        });
    }

    // Static Creation Method
    static fromPersistence(data: IAddress) {
        return new Address({ ...data, ...PersistenceToAuditableSchema.parse(data) });
    }

    public update(data: Partial<IAddress>, user: SharedUser) {
        const newData = { ...this, ...data, updatedById: user.id, updatedAt: TemporalValue.getNow() };
        const { success, error } = AddressUpdateCommandSchema.safeParse(newData);

        if (!success) throw BadRequestError(formatZodError(error), { remarks: 'Updating address failed' });

        return new Address(newData);
    }

    public toString() {
        return `${this.address1}, ${this.address2}, ${this.city}, ${this.stateOrProvince}, ${this.country}`;
    }
}
