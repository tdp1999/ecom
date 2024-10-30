import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateImageColumn1730263232261 implements MigrationInterface {
    name = 'UpdateImageColumn1730263232261';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`brands\` CHANGE \`image\` \`image\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`brands\` CHANGE \`image\` \`image\` varchar(255) NOT NULL
        `);
    }
}
