import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductTable1730347003290 implements MigrationInterface {
    name = 'CreateProductTable1730347003290';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`products\` (
                \`id\` varchar(36) NOT NULL,
                \`brandId\` varchar(36) NULL,
                \`categoryId\` varchar(36) NULL,
                \`name\` varchar(255) NOT NULL,
                \`gender\` enum ('MALE', 'FEMALE', 'UNISEX') NOT NULL,
                \`price\` decimal(10, 2) NOT NULL,
                \`sale_price\` decimal(10, 2) NOT NULL DEFAULT '0.00',
                \`colors\` text NULL,
                \`quantity\` int NOT NULL DEFAULT '0',
                \`content\` mediumtext NULL,
                \`description\` text NULL,
                \`rating\` float NULL DEFAULT '0',
                \`saleCount\` int NOT NULL DEFAULT '0',
                \`status\` enum ('active', 'inactive') NOT NULL DEFAULT 'active',
                \`createdAt\` bigint NOT NULL,
                \`updatedAt\` bigint NOT NULL,
                \`deletedAt\` bigint NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE \`products\`
        `);
    }
}
