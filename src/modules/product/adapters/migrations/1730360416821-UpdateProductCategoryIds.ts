import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProductCategoryIds1730360416821 implements MigrationInterface {
    name = 'UpdateProductCategoryIds1730360416821';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`products\` CHANGE \`categoryId\` \`categoryIds\` varchar(36) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\` DROP COLUMN \`categoryIds\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\`
            ADD \`categoryIds\` text NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`products\` DROP COLUMN \`categoryIds\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\`
            ADD \`categoryIds\` varchar(36) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`products\` CHANGE \`categoryIds\` \`categoryId\` varchar(36) NULL
        `);
    }
}
