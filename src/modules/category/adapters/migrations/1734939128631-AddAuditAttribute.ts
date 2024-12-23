import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuditAttribute1734939128631 implements MigrationInterface {
    name = 'AddAuditAttribute1734939128631';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const defaultId = '0';
        await queryRunner.query(`
            ALTER TABLE categories
                ADD created_by_id varchar(255) NOT NULL DEFAULT ${defaultId},
                ADD updated_by_id varchar(255) NOT NULL DEFAULT ${defaultId},
                ADD deleted_by_id varchar(255) NULL     DEFAULT NULL
        `);

        // Get the root user ID
        const rootUserResult = await queryRunner.query(`
            SELECT id
            FROM users
            WHERE role = 'root_admin'
            LIMIT 1
        `);

        if (rootUserResult && rootUserResult.length > 0) {
            const rootUserId = rootUserResult[0].id;

            // Update all records with root user ID
            await queryRunner.query(
                ` UPDATE categories
                  SET created_by_id = ?
                  WHERE created_by_id = ${defaultId}`,
                [rootUserId],
            );

            await queryRunner.query(
                ` UPDATE categories
                  SET updated_by_id = ?
                  WHERE updated_by_id = ${defaultId}`,
                [rootUserId],
            );
        } else {
            console.warn('Root user not found. Records will keep the default-user value.');
        }

        // Remove the default values after update
        await queryRunner.query(`
            ALTER TABLE categories
                ALTER COLUMN \`created_by_id\` DROP DEFAULT,
                ALTER
                    COLUMN \`updated_by_id\` DROP
                    DEFAULT
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE categories
                DROP COLUMN deleted_by_id,
                DROP COLUMN updated_by_id,
                DROP COLUMN created_by_id
        `);
    }
}
