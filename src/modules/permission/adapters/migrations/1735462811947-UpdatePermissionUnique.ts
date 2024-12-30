import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePermissionUnique1735462811947 implements MigrationInterface {
    name = 'UpdatePermissionUnique1735462811947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`IDX_48ce552495d14eae9b187bb671\` ON \`permissions\`
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`IDX_48ce552495d14eae9b187bb671\` ON \`permissions\` (\`name\`)
        `);
    }

}
