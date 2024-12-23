import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuditAttributeToUser1734944219582 implements MigrationInterface {
    name = 'AddAuditAttributeToUser1734944219582'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD \`created_by_id\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD \`updated_by_id\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD \`deleted_by_id\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP COLUMN \`deleted_by_id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP COLUMN \`updated_by_id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP COLUMN \`created_by_id\`
        `);
    }

}
