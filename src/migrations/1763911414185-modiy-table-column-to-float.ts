import { MigrationInterface, QueryRunner } from "typeorm";

export class ModiyTableColumnToFloat1763911414185 implements MigrationInterface {
    name = 'ModiyTableColumnToFloat1763911414185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "metric" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "metric" ADD "value" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "metric" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "metric" ADD "value" integer NOT NULL`);
    }

}
