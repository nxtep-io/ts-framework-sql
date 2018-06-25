import { Logger } from 'ts-framework';
import { EntityDatabase } from '../../lib';
import Config from '../config';
import {
  createConnection, getConnectionOptions,
  Connection, EntityManager, Repository, ObjectType, EntitySchema,
} from 'typeorm';
import { User } from './models';

export default class MainDatabase extends EntityDatabase {
  protected static readonly instance: MainDatabase = new MainDatabase({
    connectionOpts: {
      ...Config.database,
      entities: [User],
    },
  } as any);

  /**
   * Gets the singleton database instance.
   */
  static getInstance(): any {
    return this.instance;
  }
}
