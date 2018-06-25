import * as Package from 'pjson';
import { Controller, Get, BaseRequest, BaseResponse, Post } from 'ts-framework';
import { Repository, getManager } from 'typeorm';
import { User } from '../models';
import MainDatabase from '../database';

@Controller('/users')
export default class UserController {
  private static userRepositoryInstance: Repository<User>;

  /**
   * Handles the user repository instance;
   */
  private static userRepository() {
    if (!UserController.userRepositoryInstance) {
      UserController.userRepositoryInstance = MainDatabase.getInstance().getRepository(User);
    }
    return UserController.userRepositoryInstance;
  }

  /**
   * Gets the list of users, with pagination information in headers.
   *
   * @param {BaseRequest} req The express request
   * @param {BaseResponse} res The express response
   */
  @Get('/', [])
  static async list(req: BaseRequest, res: BaseResponse) {
    const { skip, limit } = req.query;

    const [count, users] = await Promise.all([
      UserController.userRepository().count(),
      UserController.userRepository().find({
        skip: skip || 0,
        take: limit || 25,
        relations: ['company', 'projects'],
      }),
    ]);

    res.set('X-Data-Length', String(count));
    res.set('X-Data-Skip', req.query.skip);
    res.set('X-Data-Limit', req.query.limit);

    return res.success(users);
  }

  /**
   * Gets an user by it's id.
   *
   * @param {BaseRequest} req The express request
   * @param {BaseResponse} res The express response
   */
  @Get('/:id')
  static async getById(req: BaseRequest, res: BaseResponse) {
    const instance = await UserController
      .userRepository()
      .findOneOrFail(req.params.id, {
        relations: ['company', 'projects'],
      });
    return res.success(instance);
  }

  /**
   * Creates a new User and inserts it in the database.
   *
   * @param {BaseRequest} req The express request
   * @param {BaseResponse} res The express response
   */
  @Post('/', [])
  static async create(req: BaseRequest, res: BaseResponse) {
    const user = new User(req.body);
    await UserController.userRepository().insert(user);
    return res.success(user);
  }

  /**
   * Set the User company by it's id.
   *
   * @param {BaseRequest} req The express request
   * @param {BaseResponse} res The express response
   */
  @Post('/:id/company/:companyId')
  static async setCompany(req: BaseRequest, res: BaseResponse) {
    const instance = await UserController
      .userRepository()
      .findOneOrFail(req.params.id);

    instance.company = req.params.companyId;
    await UserController.userRepository().save(instance);
    return res.success(instance);
  }

  /**
   * Add User to the Project by it's id.
   *
   * @param {BaseRequest} req The express request
   * @param {BaseResponse} res The express response
   */
  @Post('/:id/project/:projectId')
  static async addUser(req: BaseRequest, res: BaseResponse) {
    const instance = await UserController.userRepository().findOneOrFail(req.params.id);
    
    return res.success(await UserController.userRepository()
    .createQueryBuilder()
    .relation(User, 'projects')
    .of(instance)
    .add(req.params.projectId));
  }
}
