import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTables1731301780746 implements MigrationInterface {
    name = 'CreateUserTables1731301780746';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`users\`
            (
                \`id\`        varchar(36)  NOT NULL,
                \`email\`     varchar(255) NOT NULL,
                \`password\`  varchar(255) NOT NULL,
                \`salt\`      varchar(255) NOT NULL,
                \`role\`      enum ('admin', 'user') NOT NULL,
                \`status\`    enum (
                    'active',
                    'pending',
                    'inactive',
                    'banned',
                    'deleted'
                ) NOT NULL DEFAULT 'active',
                \`createdAt\` bigint       NOT NULL,
                \`updatedAt\` bigint       NOT NULL,
                \`deletedAt\` bigint NULL,
                UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`user_profiles\`
            (
                \`id\`        varchar(36)  NOT NULL,
                \`firstName\` varchar(255) NOT NULL,
                \`lastName\`  varchar(255) NOT NULL,
                \`avatar\`    varchar(255) NULL,
                \`phone\`     varchar(255) NULL,
                \`address\`   varchar(255) NULL,
                \`birthday\`  bigint NULL,
                \`gender\`    enum ('MALE', 'FEMALE', 'OTHER') NULL,
                \`userId\`    varchar(255) NULL,
                UNIQUE INDEX \`REL_8481388d6325e752cd4d7e26c6\` (\`userId\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`user_profiles\`
                ADD CONSTRAINT \`FK_8481388d6325e752cd4d7e26c6d\` FOREIGN KEY (\`userId\`) REFERENCES \`users\` (\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user_profiles\` DROP FOREIGN KEY \`FK_8481388d6325e752cd4d7e26c6d\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_8481388d6325e752cd4d7e26c6\` ON \`user_profiles\`
        `);
        await queryRunner.query(`
            DROP TABLE \`user_profiles\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\`
        `);
        await queryRunner.query(`
            DROP TABLE \`users\`
        `);
    }
}
