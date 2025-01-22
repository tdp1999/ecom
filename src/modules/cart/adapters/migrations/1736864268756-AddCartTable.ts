import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCartTable1736864268756 implements MigrationInterface {
    name = 'AddCartTable1736864268756';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`carts\`
            (
                \`id\`            varchar(36)  NOT NULL,
                \`created_at\`    bigint       NOT NULL,
                \`created_by_id\` varchar(255) NOT NULL,
                \`updated_at\`    bigint       NOT NULL,
                \`updated_by_id\` varchar(255) NOT NULL,
                \`deleted_at\`    bigint       NULL,
                \`deleted_by_id\` varchar(255) NULL,
                \`userId\`        varchar(36)  NULL,
                \`productId\`     varchar(36)  NULL,
                \`attribute\`     varchar(255) NULL     DEFAULT '',
                \`quantity\`      int          NOT NULL DEFAULT '1',
                UNIQUE INDEX \`IDX_carts_userId_productId_attribute\` (\`userId\`, \`productId\`, \`attribute\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`IDX_carts_userId_productId_attribute\` ON \`carts\`
        `);
        await queryRunner.query(`
            DROP TABLE \`carts\`
        `);
    }
}
