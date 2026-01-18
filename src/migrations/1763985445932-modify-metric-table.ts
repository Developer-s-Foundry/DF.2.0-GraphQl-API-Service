import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyMetricTable1763985445932 implements MigrationInterface {
    name = 'ModifyMetricTable1763985445932'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "metric" DROP CONSTRAINT "FK_e349d5c307cf8c81c38cd95b699"`);
        await queryRunner.query(`ALTER TABLE "metric" RENAME COLUMN "projectId" TO "project_id"`);
        await queryRunner.query(`ALTER TABLE "metric" ALTER COLUMN "project_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "metric" ADD CONSTRAINT "FK_974ee748aa3e58e602201951b8a" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "metric" DROP CONSTRAINT "FK_974ee748aa3e58e602201951b8a"`);
        await queryRunner.query(`ALTER TABLE "metric" ALTER COLUMN "project_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "metric" RENAME COLUMN "project_id" TO "projectId"`);
        await queryRunner.query(`ALTER TABLE "metric" ADD CONSTRAINT "FK_e349d5c307cf8c81c38cd95b699" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
