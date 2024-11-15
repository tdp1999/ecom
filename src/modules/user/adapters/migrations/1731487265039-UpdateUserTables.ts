import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserTables1731487265039 implements MigrationInterface {
    name = 'UpdateUserTables1731487265039';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user_profiles\` DROP FOREIGN KEY \`FK_8481388d6325e752cd4d7e26c6d\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user_profiles\`
                ADD CONSTRAINT \`FK_8481388d6325e752cd4d7e26c6d\` FOREIGN KEY (\`userId\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user_profiles\` DROP FOREIGN KEY \`FK_8481388d6325e752cd4d7e26c6d\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user_profiles\`
                ADD CONSTRAINT \`FK_8481388d6325e752cd4d7e26c6d\` FOREIGN KEY (\`userId\`) REFERENCES \`users\` (\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
}
