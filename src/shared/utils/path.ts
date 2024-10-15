import * as path from 'path';

export function getEntityPaths(concretePath?: string): string[] {
    return concretePath
        ? concretePath.split(',').map((entityPath) => {
              return path.join(path.dirname(__dirname), entityPath.replace('src', '').replace(/\.ts/g, '.{ts,js}'));
          })
        : [path.join(path.dirname(__dirname), 'modules', '**', '*.entity.{ts,js}')];
}

export function getMigrationPaths(concretePath?: string): string[] {
    return concretePath
        ? concretePath.split(',').map((migrationPath) => {
              return path.join(path.dirname(__dirname), migrationPath.replace('src', '').replace(/\.ts/g, '.{ts,js}'));
          })
        : [path.join(path.dirname(__dirname), 'modules', '**', 'migrations', '*.{ts,js}')];
}
