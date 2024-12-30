import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveRole1735467785226 implements MigrationInterface {
    name = 'RemoveRole1735467785226';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\`
                DROP COLUMN \`role\`
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\`
                ADD \`role\` enum ('root_admin', 'admin', 'user') NOT NULL
        `);
    }
}
