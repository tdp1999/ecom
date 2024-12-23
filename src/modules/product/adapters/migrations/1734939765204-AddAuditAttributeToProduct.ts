import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuditAttributeToProduct1734939765204 implements MigrationInterface {
    name = 'AddAuditAttributeToProduct1734939765204';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const defaultId = '0';
        await queryRunner.query(`
            ALTER TABLE products
                DROP COLUMN createdAt,
                DROP COLUMN updatedAt,
                DROP COLUMN deletedAt,
                ADD created_at    bigint       NOT NULL,
                ADD updated_at    bigint       NOT NULL,
                ADD deleted_at    bigint       NULL,
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
                ` UPDATE products
                  SET created_by_id = ?
                  WHERE created_by_id = ${defaultId}`,
                [rootUserId],
            );

            await queryRunner.query(
                ` UPDATE products
                  SET updated_by_id = ?
                  WHERE updated_by_id = ${defaultId}`,
                [rootUserId],
            );
        } else {
            console.warn('Root user not found. Records will keep the default-user value.');
        }

        // Remove the default values after update
        await queryRunner.query(`
            ALTER TABLE products
                ALTER COLUMN created_by_id DROP DEFAULT,
                ALTER COLUMN updated_by_id DROP DEFAULT
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE products
                DROP COLUMN deleted_at,
                DROP COLUMN updated_at,
                DROP COLUMN created_at,
                DROP COLUMN deleted_by_id,
                DROP COLUMN updated_by_id,
                DROP COLUMN created_by_id,
                ADD deletedAt bigint NULL,
                ADD updatedAt bigint NOT NULL,
                ADD createdAt bigint NOT NULL

        `);
    }
}
