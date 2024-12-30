import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserEntity1735465964205 implements MigrationInterface {
    name = 'UpdateUserEntity1735465964205';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Rename existing columns (this preserves data)
        const columns = ['createdAt', 'updatedAt', 'deletedAt'];

        const columnInfo = await queryRunner.getTable('users');
        const tableColumns = columnInfo?.columns.map((column) => column.name);
        if (columnInfo && columns.every((column) => tableColumns?.includes(column))) {
            await queryRunner.query(`
                ALTER TABLE users
                    RENAME COLUMN createdAt TO created_at,
                    RENAME COLUMN updatedAt TO updated_at,
                    RENAME COLUMN deletedAt TO deleted_at
            `);
        }

        // 2. Add new isSystem column
        const isSystemColumn = columnInfo?.columns.find((column) => column.name === 'isSystem');
        if (!isSystemColumn) {
            await queryRunner.query(`
                ALTER TABLE users
                    ADD COLUMN isSystem tinyint NOT NULL DEFAULT 0
            `);
        }

        // 3. Update created_by_id and updated_by_id in a singles query
        // First, ensure no NULL values exist (if needed)
        await queryRunner.query(`
            UPDATE users
            SET created_by_id = COALESCE(created_by_id, 'system'),
                updated_by_id = COALESCE(updated_by_id, 'system')
            WHERE created_by_id IS NULL
               OR updated_by_id IS NULL
        `);

        // Then modify the columns to be NOT NULL
        await queryRunner.query(`
            ALTER TABLE users
                MODIFY COLUMN created_by_id varchar(255) NOT NULL,
                MODIFY COLUMN updated_by_id varchar(255) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 1. Revert the column modifications
        await queryRunner.query(`
            ALTER TABLE users
                MODIFY COLUMN created_by_id varchar(255) NULL,
                MODIFY COLUMN updated_by_id varchar(255) NULL
        `);

        // 2. Remove isSystem column
        await queryRunner.query(`
            ALTER TABLE users
                DROP COLUMN isSystem
        `);

        // 3. Rename columns back to original names
        await queryRunner.query(`
            ALTER TABLE users
                RENAME COLUMN created_at TO createdAt,
                RENAME COLUMN updated_at TO updatedAt,
                RENAME COLUMN deleted_at TO deletedAt
        `);
    }
}
