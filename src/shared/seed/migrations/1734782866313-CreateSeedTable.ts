import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSeedTable1734782866313 implements MigrationInterface {
    name = 'CreateSeedTable1734782866313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`seeds\` (
                \`id\` varchar(36) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`isCompleted\` tinyint NOT NULL DEFAULT 0,
                \`executed_at\` bigint NOT NULL,
                UNIQUE INDEX \`IDX_9978f4e4f60d7f1fc1af7c7ff9\` (\`name\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`IDX_9978f4e4f60d7f1fc1af7c7ff9\` ON \`seeds\`
        `);
        await queryRunner.query(`
            DROP TABLE \`seeds\`
        `);
    }

}
