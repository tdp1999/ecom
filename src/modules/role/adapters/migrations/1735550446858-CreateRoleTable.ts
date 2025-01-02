import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoleTable1735550446858 implements MigrationInterface {
    name = 'CreateRoleTable1735550446858';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE roles
            (
                id            varchar(36)  NOT NULL,
                created_at    bigint       NOT NULL,
                created_by_id varchar(255) NOT NULL,
                updated_at    bigint       NOT NULL,
                updated_by_id varchar(255) NOT NULL,
                deleted_at    bigint       NULL,
                deleted_by_id varchar(255) NULL,
                name          varchar(100) NOT NULL,
                description   text         NULL,
                permissionIds json         NULL,
                PRIMARY KEY (id)
            )
                ENGINE = InnoDB
                DEFAULT CHARSET = utf8mb4
                COLLATE = utf8mb4_unicode_ci
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE roles
        `);
    }
}
