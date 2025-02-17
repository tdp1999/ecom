import { UUID } from '@shared/types/general.type';

export abstract class BaseModel {
    readonly id: string;

    readonly createdAt: bigint;
    readonly createdById: UUID;

    readonly updatedAt: bigint;
    readonly updatedById: UUID;

    readonly deletedAt?: bigint;
    readonly deletedById?: UUID;

    protected constructor(props: Record<string, any>) {
        Object.assign(this, props);
    }
}
