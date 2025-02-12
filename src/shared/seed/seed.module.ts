import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from '@permission/adapters/permission.entity';
import databaseConfig from '@shared/configs/database.config';
import generalConfig from '@shared/configs/general.config';
import { ClientModule } from '@shared/modules/client/client.module';
import { SeedEntity } from '@shared/seed/seed.entity';
import { SeedService } from '@shared/seed/seed.service';
import { PermissionSeeder } from '@shared/seed/seeders/permission.seeder';
import { UserSeeder } from '@shared/seed/seeders/user.seeder';
import { UserProfileEntity } from '@user/adapters/repository/user-profile.entity';
import { UserEntity } from '@user/adapters/repository/user.entity';

const seeder = [UserSeeder, PermissionSeeder];

@Module({
    providers: [Logger, SeedService, ...seeder],
    imports: [
        ConfigModule,
        ClientModule.registerAsync(),
        ConfigModule.forRoot({ load: [databaseConfig, generalConfig] }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const config = configService.get('database');
                const environment = configService.get('general').environment || 'local';

                if (!config) {
                    throw new Error('Database configuration not found');
                }

                return {
                    ...config,
                    logging: environment === 'local',
                };
            },
        }),
        TypeOrmModule.forFeature([SeedEntity, UserEntity, UserProfileEntity, PermissionEntity]),
    ],
})
export class SeedModule {}
