import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRelationInUserTables1731849131931 implements MigrationInterface {
    name = 'UpdateRelationInUserTables1731849131931';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user_profiles\` DROP FOREIGN KEY \`FK_8481388d6325e752cd4d7e26c6d\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_8481388d6325e752cd4d7e26c6\` ON \`user_profiles\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user_profiles\` DROP COLUMN \`userId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\`
                ADD \`profileId\` varchar(36) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\`
                ADD UNIQUE INDEX \`IDX_b1bda35cdb9a2c1b777f5541d8\` (\`profileId\`)
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`REL_b1bda35cdb9a2c1b777f5541d8\` ON \`users\` (\`profileId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\`
                ADD CONSTRAINT \`FK_b1bda35cdb9a2c1b777f5541d87\` FOREIGN KEY (\`profileId\`) REFERENCES \`user_profiles\` (\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_b1bda35cdb9a2c1b777f5541d87\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_b1bda35cdb9a2c1b777f5541d8\` ON \`users\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP INDEX \`IDX_b1bda35cdb9a2c1b777f5541d8\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP COLUMN \`profileId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user_profiles\`
                ADD \`userId\` varchar(255) NULL
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`REL_8481388d6325e752cd4d7e26c6\` ON \`user_profiles\` (\`userId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`user_profiles\`
                ADD CONSTRAINT \`FK_8481388d6325e752cd4d7e26c6d\` FOREIGN KEY (\`userId\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }
}
