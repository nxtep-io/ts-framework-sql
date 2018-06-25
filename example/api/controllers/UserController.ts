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
    if (!this.userRepositoryInstance) {
      this.userRepositoryInstance = MainDatabase.getInstance().getRepository(User);
    }

    return this.userRepositoryInstance;
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
  static async getContract(req: BaseRequest, res: BaseResponse) {
    const userId: string = req.params.id;
    const contract = await UserController.userRepository().findOneOrFail(userId);
    return res.success(contract);
  }

  /**
   * Creates a new User and inserts it in the database.
   *
   * @param {BaseRequest} req The express request
   * @param {BaseResponse} res The express response
   */
  @Post('/', [])
  static async create(req: BaseRequest, res: BaseResponse) {
    const user = await UserController.userRepository().insert(new User(req.body));
    return res.success(user);
  }
}
