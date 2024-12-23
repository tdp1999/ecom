import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { SeedEntity } from '@shared/seed/seed.entity';
import { ISeed } from '@shared/seed/seed.interface';
import { UserSeeder } from '@shared/seed/seeders/user.seeder';
import { BooleanValue } from '@shared/vos/boolean.value';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
    private readonly logger = new Logger(SeedService.name);

    constructor(
        private userSeeder: UserSeeder,
        @Inject(ConfigService) private configService: ConfigService,
        @InjectRepository(SeedEntity) private seedRepository: Repository<SeedEntity>,
    ) {}

    async runSeeds() {
        const shouldRunSeed = BooleanValue.toBoolean(this.configService.get<boolean>('general.seedingEnabled'));

        if (!shouldRunSeed) {
            this.logger.debug('Seeding is disabled');
            return;
        }

        const seeders: { name: string; seeder: ISeed }[] = [{ name: 'Default User', seeder: this.userSeeder }];

        for (const { name, seeder } of seeders) {
            const existingSeed = await this.seedRepository.findOne({ where: { name } });

            if (!existingSeed || !existingSeed.isCompleted) {
                try {
                    this.logger.log(`Running ${name} seeder...`);
                    await seeder.seed();
                    await this.seedRepository.save({ name, isCompleted: true, executedAt: BigInt(Date.now()) });
                    this.logger.log(`${name} seeder completed successfully`);
                } catch (error) {
                    this.logger.error(`Error running ${name} seeder`, error.stack);
                    throw error;
                }
            } else {
                this.logger.debug(`Skipping ${name} seeder as it's already executed`);
            }
        }
    }
}
