import * as Package from 'pjson';
import { Controller, Get, BaseRequest, BaseResponse } from 'ts-framework';
import { Repository, getManager } from 'typeorm';
import { User } from '../models';

@Controller()
export default class UserController {
  private static userRepositoryInstance: Repository<User>;

  /**
   * Handles the user repository instance;
   */
  private static userRepository() {
    if (!this.userRepositoryInstance) { 
      this.userRepositoryInstance = getManager().getRepository(User); 
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
  static async getUsers(req: BaseRequest, res: BaseResponse) {
    const { skip, limit } = req.query.pagination;
    const findOptions = { skip, take: limit, where: {} };

    const [count, users] = await Promise.all([
      UserController.userRepository().count(),
      UserController.userRepository().find(findOptions),
    ]);

    res.set('X-Data-Length', String(count));
    res.set('X-Data-Skip', req.query.skip);
    res.set('X-Data-Limit', req.query.limit);

    return res.success(users);
  }
}
