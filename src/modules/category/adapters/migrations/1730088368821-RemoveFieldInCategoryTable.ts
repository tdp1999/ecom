import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveFieldInCategoryTable1730088368821 implements MigrationInterface {
    name = 'RemoveFieldInCategoryTable1730088368821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`categories\` DROP COLUMN \`is_deleted\`
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`categories\`
            ADD \`is_deleted\` tinyint NULL DEFAULT '0'
        `);
    }

}
