import * as Package from 'pjson';
import { Controller, Get, BaseRequest, BaseResponse, Post } from 'ts-framework';
import { Repository, getManager } from 'typeorm';
import { Project } from '../models';
import MainDatabase from '../database';

@Controller('/projects')
export default class ProjectController {
  private static projectRepositoryInstance: Repository<Project>;

  /**
   * Handles the Project repository instance;
   */
  private static projectRepository() {
    if (!ProjectController.projectRepositoryInstance) {
      ProjectController.projectRepositoryInstance = MainDatabase.getInstance().getRepository(Project);
    }
    return ProjectController.projectRepositoryInstance;
  }

  /**
   * Gets the list of Projects, with pagination information in headers.
   *
   * @param {BaseRequest} req The express request
   * @param {BaseResponse} res The express response
   */
  @Get('/', [])
  static async list(req: BaseRequest, res: BaseResponse) {
    const { skip, limit } = req.query;

    const [count, projects] = await Promise.all([
      ProjectController.projectRepository().count(),
      ProjectController.projectRepository().find({
        skip: skip || 0,
        take: limit || 25,
        relations: ['company', 'users'],
      }),
    ]);

    res.set('X-Data-Length', String(count));
    res.set('X-Data-Skip', req.query.skip);
    res.set('X-Data-Limit', req.query.limit);

    return res.success(projects);
  }

  /**
   * Gets a Project by it's id.
   *
   * @param {BaseRequest} req The express request
   * @param {BaseResponse} res The express response
   */
  @Get('/:id')
  static async getById(req: BaseRequest, res: BaseResponse) {
    const instance = await ProjectController
      .projectRepository()
      .findOneOrFail(req.params.id, {
        relations: ['company', 'users'],
      });
    return res.success(instance);
  }

  /**
   * Creates a new Project and inserts it in the database.
   *
   * @param {BaseRequest} req The express request
   * @param {BaseResponse} res The express response
   */
  @Post('/', [])
  static async create(req: BaseRequest, res: BaseResponse) {
    const project = new Project(req.body);
    await ProjectController.projectRepository().insert(project);
    return res.success(project);
  }

  /**
   * Set the Project compny by it's id.
   *
   * @param {BaseRequest} req The express request
   * @param {BaseResponse} res The express response
   */
  @Post('/:id/company/:companyId')
  static async setCompany(req: BaseRequest, res: BaseResponse) {
    const instance = await ProjectController
      .projectRepository()
      .findOneOrFail(req.params.id);

    instance.company = req.params.companyId;
    await ProjectController.projectRepository().save(instance);
    return res.success(instance);
  }
}
