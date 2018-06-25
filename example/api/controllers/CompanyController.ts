import * as Package from 'pjson';
import { Controller, Get, BaseRequest, BaseResponse, Post } from 'ts-framework';
import { Repository, getManager } from 'typeorm';
import { Company, User, Project } from '../models';
import MainDatabase from '../database';

@Controller('/companies')
export default class CompanyController {
  private static userRepositoryInstance: Repository<User>;
  private static projectRepositoryInstance: Repository<Project>;
  private static companyRepositoryInstance: Repository<Company>;

  /**
   * Handles the Company repository instance;
   */
  private static companyRepository() {
    if (!CompanyController.companyRepositoryInstance) {
      CompanyController.companyRepositoryInstance = MainDatabase.getInstance().getRepository(Company);
    }
    return CompanyController.companyRepositoryInstance;
  }

  /**
   * Handles the user repository instance;
   */
  private static userRepository() {
    if (!CompanyController.userRepositoryInstance) {
      CompanyController.userRepositoryInstance = MainDatabase.getInstance().getRepository(User);
    }
    return CompanyController.userRepositoryInstance;
  }

   /**
   * Handles the project repository instance;
   */
  private static projectRepository() {
    if (!CompanyController.projectRepositoryInstance) {
      CompanyController.projectRepositoryInstance = MainDatabase.getInstance().getRepository(Project);
    }
    return CompanyController.projectRepositoryInstance;
  }

  /**
   * Gets the list of Companies, with pagination information in headers.
   *
   * @param {BaseRequest} req The express request
   * @param {BaseResponse} res The express response
   */
  @Get('/', [])
  static async list(req: BaseRequest, res: BaseResponse) {
    const { skip, limit } = req.query;

    const [count, companies] = await Promise.all([
      CompanyController.companyRepository().count(),
      CompanyController.companyRepository().find({
        skip: skip || 0,
        take: limit || 25,
        relations: ['users', 'projects'],
      }),
    ]);

    res.set('X-Data-Length', String(count));
    res.set('X-Data-Skip', req.query.skip);
    res.set('X-Data-Limit', req.query.limit);

    return res.success(companies);
  }

  /**
   * Gets a Company by it's id.
   *
   * @param {BaseRequest} req The express request
   * @param {BaseResponse} res The express response
   */
  @Get('/:id')
  static async getById(req: BaseRequest, res: BaseResponse) {
    const instance = await CompanyController
      .companyRepository()
      .findOneOrFail(req.params.id, {
        relations: ['users', 'projects'],
      });
    return res.success(instance);
  }

  /**
   * Creates a new Company and inserts it in the database.
   *
   * @param {BaseRequest} req The express request
   * @param {BaseResponse} res The express response
   */
  @Post('/', [])
  static async create(req: BaseRequest, res: BaseResponse) {
    const company = new Company(req.body);
    await CompanyController.companyRepository().insert(company);
    return res.success(company);
  }
}
