import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateColumns1730263427834 implements MigrationInterface {
    name = 'UpdateColumns1730263427834';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`brands\` CHANGE \`description\` \`description\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`brands\` CHANGE \`tag_line\` \`tag_line\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`brands\` CHANGE \`tag_line\` \`tag_line\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`brands\` CHANGE \`description\` \`description\` varchar(255) NOT NULL
        `);
    }
}
