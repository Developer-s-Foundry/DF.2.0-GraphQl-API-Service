import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNewTables1763548719093 implements MigrationInterface {
    name = 'CreateNewTables1763548719093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "type" character varying NOT NULL, "metric_name" character varying NOT NULL, "time_stamp" TIMESTAMP WITH TIME ZONE NOT NULL, "labels" jsonb NOT NULL, "metric" jsonb NOT NULL, "extras" jsonb NOT NULL, "projectId" integer, CONSTRAINT "PK_350604cbdf991d5930d9e618fbd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project" ("id" integer NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "base_url" character varying NOT NULL, "prometheus_metric_url" character varying NOT NULL, "team_id" integer NOT NULL, "owner_id" integer NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "log" ADD CONSTRAINT "FK_0c0ad31dd4033de83a2c47f2c82" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "log" DROP CONSTRAINT "FK_0c0ad31dd4033de83a2c47f2c82"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "log"`);
    }

}
