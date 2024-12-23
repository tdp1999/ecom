import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRole1734923055234 implements MigrationInterface {
    name = 'AddRole1734923055234';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('root_admin', 'admin', 'user') NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('admin', 'user') NOT NULL
        `);
    }
}
