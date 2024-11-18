import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRelationInUserTables1731849679449 implements MigrationInterface {
    name = 'UpdateRelationInUserTables1731849679449';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_b1bda35cdb9a2c1b777f5541d87\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_b1bda35cdb9a2c1b777f5541d8\` ON \`users\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\`
                ADD CONSTRAINT \`FK_b1bda35cdb9a2c1b777f5541d87\` FOREIGN KEY (\`profileId\`) REFERENCES \`user_profiles\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_b1bda35cdb9a2c1b777f5541d87\`
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`IDX_b1bda35cdb9a2c1b777f5541d8\` ON \`users\` (\`profileId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\`
                ADD CONSTRAINT \`FK_b1bda35cdb9a2c1b777f5541d87\` FOREIGN KEY (\`profileId\`) REFERENCES \`user_profiles\` (\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
}
