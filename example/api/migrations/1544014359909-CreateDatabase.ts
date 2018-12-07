import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateDatabase1544014359909 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "companyId" varchar, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "project" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "companyId" varchar)`);
        await queryRunner.query(`CREATE TABLE "company" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "project_users_user" ("projectId" varchar NOT NULL, "userId" varchar NOT NULL, PRIMARY KEY ("projectId", "userId"))`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "companyId" varchar, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "FK_86586021a26d1180b0968f98502" FOREIGN KEY ("companyId") REFERENCES "company" ("id"))`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "name", "email", "companyId") SELECT "id", "name", "email", "companyId" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "temporary_project" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "companyId" varchar, CONSTRAINT "FK_17c18aa92afa5fa328e9e181fe8" FOREIGN KEY ("companyId") REFERENCES "company" ("id"))`);
        await queryRunner.query(`INSERT INTO "temporary_project"("id", "name", "companyId") SELECT "id", "name", "companyId" FROM "project"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`ALTER TABLE "temporary_project" RENAME TO "project"`);
        await queryRunner.query(`CREATE TABLE "temporary_project_users_user" ("projectId" varchar NOT NULL, "userId" varchar NOT NULL, CONSTRAINT "FK_9666c6dcd769c698bed4aa4bf55" FOREIGN KEY ("projectId") REFERENCES "project" ("id") ON DELETE CASCADE, CONSTRAINT "FK_f8300efd87679e1e21532be9808" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE, PRIMARY KEY ("projectId", "userId"))`);
        await queryRunner.query(`INSERT INTO "temporary_project_users_user"("projectId", "userId") SELECT "projectId", "userId" FROM "project_users_user"`);
        await queryRunner.query(`DROP TABLE "project_users_user"`);
        await queryRunner.query(`ALTER TABLE "temporary_project_users_user" RENAME TO "project_users_user"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "project_users_user" RENAME TO "temporary_project_users_user"`);
        await queryRunner.query(`CREATE TABLE "project_users_user" ("projectId" varchar NOT NULL, "userId" varchar NOT NULL, PRIMARY KEY ("projectId", "userId"))`);
        await queryRunner.query(`INSERT INTO "project_users_user"("projectId", "userId") SELECT "projectId", "userId" FROM "temporary_project_users_user"`);
        await queryRunner.query(`DROP TABLE "temporary_project_users_user"`);
        await queryRunner.query(`ALTER TABLE "project" RENAME TO "temporary_project"`);
        await queryRunner.query(`CREATE TABLE "project" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "companyId" varchar)`);
        await queryRunner.query(`INSERT INTO "project"("id", "name", "companyId") SELECT "id", "name", "companyId" FROM "temporary_project"`);
        await queryRunner.query(`DROP TABLE "temporary_project"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "companyId" varchar, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "user"("id", "name", "email", "companyId") SELECT "id", "name", "email", "companyId" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`DROP TABLE "project_users_user"`);
        await queryRunner.query(`DROP TABLE "company"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
