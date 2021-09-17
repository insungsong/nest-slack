import {MigrationInterface, QueryRunner} from "typeorm";

export class categoryToType1631861159243 implements MigrationInterface {
    name = 'categoryToType1631861159243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."channels" ALTER COLUMN "private" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."channels" ALTER COLUMN "private" SET DEFAULT false`);
    }

}
