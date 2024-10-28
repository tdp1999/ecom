import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBrandTable1730101884839 implements MigrationInterface {
    name = 'CreateBrandTable1730101884839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`brands\` (
                \`id\` varchar(36) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`image\` varchar(255) NOT NULL,
                \`description\` varchar(255) NOT NULL,
                \`tag_line\` varchar(255) NOT NULL,
                \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active',
                \`created_at\` bigint NOT NULL,
                \`updated_at\` bigint NOT NULL,
                \`deleted_at\` bigint NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE \`brands\`
        `);
    }

}
