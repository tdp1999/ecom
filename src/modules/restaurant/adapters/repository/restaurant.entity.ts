import { STATUS } from '@shared/enums/status.enum';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Restaurant } from '../../domain/model/restaurant.model';

@Entity('restaurants')
export class RestaurantEntity extends BaseEntity implements Restaurant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    phone: string;

    @Column({ nullable: true, type: 'simple-array', name: 'cover_images' })
    coverImages: string[];

    @Column({ nullable: true, type: 'simple-array', name: 'images' })
    images: string[];

    @Column({ nullable: true, name: 'short_introduction' })
    shortIntroduction?: string;

    @Column({ nullable: true })
    description?: string;

    @Column('json', { nullable: true })
    geometry?: {
        type: 'Point';
        coordinates: [number, number];
    };

    @Column({ type: 'float', default: 0 })
    rating: number;

    @Column({ type: 'int', default: 0, name: 'rating_count' })
    ratingCount: number;

    @Column({ nullable: true, type: 'simple-array' })
    categories: string[];

    @Column({ nullable: true, type: 'simple-array' })
    specifications: string[];

    @Column({ type: 'enum', enum: STATUS, default: STATUS.ACTIVE })
    status: STATUS;

    @Column({ type: 'boolean', name: 'is_deleted', default: false })
    isDeleted: boolean;

    @Column({ type: 'bigint', name: 'created_at' })
    createdAt: bigint;

    @Column({ type: 'bigint', name: 'updated_at' })
    updatedAt: bigint;
}
