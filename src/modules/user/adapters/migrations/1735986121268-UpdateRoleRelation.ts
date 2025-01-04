import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRoleRelation1735986121268 implements MigrationInterface {
    name = 'UpdateRoleRelation1735986121268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD \`roleId\` varchar(36) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP COLUMN \`roleId\`
        `);
    }

}
