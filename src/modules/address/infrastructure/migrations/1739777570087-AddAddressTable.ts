import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAddressTable1739777570087 implements MigrationInterface {
    name = 'AddAddressTable1739777570087';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`addresses\`
            (
                \`id\`              varchar(36)                      NOT NULL,
                \`created_at\`      bigint                           NOT NULL,
                \`created_by_id\`   varchar(255)                     NOT NULL,
                \`updated_at\`      bigint                           NOT NULL,
                \`updated_by_id\`   varchar(255)                     NOT NULL,
                \`deleted_at\`      bigint                           NULL,
                \`deleted_by_id\`   varchar(255)                     NULL,
                \`country\`         varchar(255)                     NOT NULL,
                \`stateOrProvince\` varchar(255)                     NOT NULL,
                \`city\`            varchar(255)                     NOT NULL,
                \`address1\`        varchar(200)                     NOT NULL,
                \`address2\`        varchar(200)                     NULL,
                \`addressType\`     enum ('home', 'office', 'other') NOT NULL,
                \`remarks\`         text                             NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE \`addresses\`
        `);
    }
}
