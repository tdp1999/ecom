import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateConstrainInUserTables1732525309606 implements MigrationInterface {
    name = 'UpdateConstrainInUserTables1732525309606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user_profiles\` CHANGE \`firstName\` \`firstName\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user_profiles\` CHANGE \`lastName\` \`lastName\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user_profiles\` CHANGE \`lastName\` \`lastName\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user_profiles\` CHANGE \`firstName\` \`firstName\` varchar(255) NOT NULL
        `);
    }

}
