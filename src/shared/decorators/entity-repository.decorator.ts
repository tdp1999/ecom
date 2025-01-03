import { applyDecorators, Injectable, InjectableOptions } from '@nestjs/common';
import { EntityTarget } from 'typeorm';

export const EntityRepositoryMetadata = <TEntity>(entity: EntityTarget<TEntity>): ClassDecorator => {
    return (target: object) => {
        if (!target || !entity) {
            console.error(`EntityRepositoryMetadata: Init repository fail`, entity, target);
        }
        Reflect.defineMetadata('ENTITY_REPOSITORY_METADATA', entity, target);
    };
};

export const EntityRepository = <TEntity>(
    entity: EntityTarget<TEntity>,
    options?: InjectableOptions,
): ClassDecorator => {
    return applyDecorators(Injectable(options), EntityRepositoryMetadata(entity));
};
