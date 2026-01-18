import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTableNameToMetrics1763874680293 implements MigrationInterface {
    name = 'ChangeTableNameToMetrics1763874680293'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "metric" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "metric_name" character varying NOT NULL, "time_stamp" TIMESTAMP WITH TIME ZONE NOT NULL, "metric" jsonb NOT NULL, "value" integer NOT NULL, "projectId" integer, CONSTRAINT "PK_7d24c075ea2926dd32bd1c534ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "metric" ADD CONSTRAINT "FK_e349d5c307cf8c81c38cd95b699" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "metric" DROP CONSTRAINT "FK_e349d5c307cf8c81c38cd95b699"`);
        await queryRunner.query(`DROP TABLE "metric"`);
    }

}
