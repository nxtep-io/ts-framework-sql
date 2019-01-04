import Config from '../config';
import { EntityDatabase, EntityDatabaseOptions } from 'ts-framework-sql';
import * as Models from './models';

export default class MainDatabase extends EntityDatabase {
  protected static readonly instance: MainDatabase = new MainDatabase({
    connectionOpts: {
      ...Config.database,
      entities: Object.values(Models),
    },
  } as any);

  /**
   * Gets the singleton database instance.
   */
  static getInstance(): any {
    return this.instance;
  }
}
