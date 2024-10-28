import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCategoryTable1729757059343 implements MigrationInterface {
    name = 'UpdateCategoryTable1729757059343';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`categories_closure\` (
                \`id_ancestor\` varchar(255) NOT NULL,
                \`id_descendant\` varchar(255) NOT NULL,
                INDEX \`IDX_ea1e9c4eea91160dfdb4318778\` (\`id_ancestor\`),
                INDEX \`IDX_51fff5114cc41723e8ca36cf22\` (\`id_descendant\`),
                PRIMARY KEY (\`id_ancestor\`, \`id_descendant\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`categories\`
            ADD \`parentId\` varchar(36) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`categories\`
            ADD CONSTRAINT \`FK_9a6f051e66982b5f0318981bcaa\` FOREIGN KEY (\`parentId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`categories_closure\`
            ADD CONSTRAINT \`FK_ea1e9c4eea91160dfdb4318778d\` FOREIGN KEY (\`id_ancestor\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`categories_closure\`
            ADD CONSTRAINT \`FK_51fff5114cc41723e8ca36cf227\` FOREIGN KEY (\`id_descendant\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            DROP TABLE \`category_closure\`
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`categories_closure\` DROP FOREIGN KEY \`FK_51fff5114cc41723e8ca36cf227\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`categories_closure\` DROP FOREIGN KEY \`FK_ea1e9c4eea91160dfdb4318778d\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`categories\` DROP FOREIGN KEY \`FK_9a6f051e66982b5f0318981bcaa\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`categories\` DROP COLUMN \`parentId\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_51fff5114cc41723e8ca36cf22\` ON \`categories_closure\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_ea1e9c4eea91160dfdb4318778\` ON \`categories_closure\`
        `);
        await queryRunner.query(`
            DROP TABLE \`categories_closure\`
        `);
        await queryRunner.query(`
            CREATE TABLE \`category_closure\` (
                \`ancestor_id\` varchar(255) NOT NULL,
                \`descendant_id\` varchar(255) NOT NULL,
                \`depth\` int NOT NULL,
                PRIMARY KEY (\`ancestor_id\`, \`descendant_id\`)
            ) ENGINE = InnoDB
        `);
    }
}
