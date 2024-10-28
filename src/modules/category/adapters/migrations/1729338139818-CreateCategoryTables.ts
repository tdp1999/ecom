import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCategoryTables1729338139818 implements MigrationInterface {
    name = 'CreateCategoryTables1729338139818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`category_closure\` (
                \`ancestor_id\` varchar(255) NOT NULL,
                \`descendant_id\` varchar(255) NOT NULL,
                \`depth\` int NOT NULL,
                PRIMARY KEY (\`ancestor_id\`, \`descendant_id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`categories\` (
                \`id\` varchar(36) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`isGroup\` tinyint NOT NULL,
                \`isClickable\` tinyint NOT NULL,
                \`metadata\` json NULL,
                \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active',
                \`is_deleted\` tinyint NULL DEFAULT 0,
                \`created_at\` bigint NOT NULL,
                \`updated_at\` bigint NOT NULL,
                \`deleted_at\` bigint NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE \`categories\`
        `);
        await queryRunner.query(`
            DROP TABLE \`category_closure\`
        `);
    }

}
