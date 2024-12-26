import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePermissionTable1735204648076 implements MigrationInterface {
    name = 'CreatePermissionTable1735204648076'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`permissions\` (
                \`id\` varchar(36) NOT NULL,
                \`created_at\` bigint NOT NULL,
                \`created_by_id\` varchar(255) NOT NULL,
                \`updated_at\` bigint NOT NULL,
                \`updated_by_id\` varchar(255) NOT NULL,
                \`deleted_at\` bigint NULL,
                \`deleted_by_id\` varchar(255) NULL,
                \`name\` varchar(255) NOT NULL,
                \`description\` text NULL,
                \`resource\` varchar(255) NOT NULL,
                \`action\` varchar(255) NOT NULL,
                \`slug\` varchar(255) NOT NULL,
                UNIQUE INDEX \`IDX_48ce552495d14eae9b187bb671\` (\`name\`),
                UNIQUE INDEX \`IDX_d090ad82a0e97ce764c06c7b31\` (\`slug\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`IDX_d090ad82a0e97ce764c06c7b31\` ON \`permissions\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_48ce552495d14eae9b187bb671\` ON \`permissions\`
        `);
        await queryRunner.query(`
            DROP TABLE \`permissions\`
        `);
    }

}
