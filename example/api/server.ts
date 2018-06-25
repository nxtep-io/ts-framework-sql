import Server, { Logger } from 'ts-framework';
import * as Controllers from './controllers';
import EntityDB from './database';

export default class MainServer extends Server {
  protected database: EntityDB;

  constructor() {
    super({
      cors: true,
      logger: Logger,
      secret: 'PLEASE_CHANGE_ME',
      port: process.env.PORT as any || 3000,
      controllers: Controllers,
      // sentry: {
      //   dsn: ''
      // }
    });

    // Prepare the database instance as soon as possible to prevent clashes in
    // model registration. We can connect to the real database later.
    this.database = EntityDB.getInstance();
  }

  /**
   * Handles pre-startup routines, such as starting the database up.
   *
   * @returns {Promise<void>}
   */
  async onStartup(): Promise<void> {
    // Connect to the server database
    await this.database.connect();
    this.logger.info(`Server listening in port: ${this.config.port}`);
  }
}
