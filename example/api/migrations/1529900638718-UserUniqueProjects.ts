import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Ensures the pair <User, Project> is always unique. The user cannot be any more than
 * once in a single project.
 */
export class UserUniqueProjects1529900638718 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `project_users_user` ADD UNIQUE `unique_index`(`projectId`, `userId`);');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP INDEX `unique_index` ON `project_users_user`;'); 
  }

}
