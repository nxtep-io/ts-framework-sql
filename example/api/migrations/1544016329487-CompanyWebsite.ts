import {MigrationInterface, QueryRunner} from "typeorm";

export class CompanyWebsite1544016329487 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "temporary_company" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "website" varchar)`);
        await queryRunner.query(`INSERT INTO "temporary_company"("id", "name") SELECT "id", "name" FROM "company"`);
        await queryRunner.query(`DROP TABLE "company"`);
        await queryRunner.query(`ALTER TABLE "temporary_company" RENAME TO "company"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "company" RENAME TO "temporary_company"`);
        await queryRunner.query(`CREATE TABLE "company" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "company"("id", "name") SELECT "id", "name" FROM "temporary_company"`);
        await queryRunner.query(`DROP TABLE "temporary_company"`);
    }

}
