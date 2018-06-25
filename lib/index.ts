import 'reflect-metadata';
import { createConnection, Connection, ConnectionOptions, ObjectType, EntitySchema, Repository } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { Logger, DatabaseOptions, Database } from '../common';

export interface EntityDatabaseOptions extends DatabaseOptions {
  logger?: Logger;
  connection?: Connection;
  connectionOpts?: ConnectionOptions;
  entities: any[];
}

export class EntityDatabase implements Database {
  protected logger: Logger;
  protected connection: Connection;
  protected connectionOptions: ConnectionOptions;

  /**
   * Creates a new Entity database for SQL drivers.
   * 
   * @param connection The TypeORM connection to the database
   */
  constructor(protected options: EntityDatabaseOptions) {
    // TODO: Handle connection url
    this.connection = options.connection;
    this.connectionOptions = options.connection ? options.connection.options : options.connectionOpts;
  }

  /**
   * Connects to the database, creating a connection instance if not available.
   * 
   * @returns A promise to the connection instance.
   */
  public async connect(): Promise<EntityDatabaseOptions> {
    if (this.logger) {
      // TODO: Hide authentication information
      this.logger.debug('Connecting to database', this.connectionOptions);
    }

    if (this.connection) {
      await this.connection.connect();
      return this.options;
    } else if (this.connectionOptions) {
      this.connection = await createConnection(this.connectionOptions);
      return this.options;
    }
  }

  /**
   * Gets the database current state.
   */
  public isReady(): boolean {
    return this.connection && this.connection.isConnected;
  }

  /**
   * Disconnects from existing connection, if any.
   */
  public async disconnect(): Promise<void> {
    if (this.connection) {
      if (this.logger) {
        // TODO: Hide authentication information
        this.logger.debug('Disconnecting from database', this.connectionOptions);
      }
      await this.connection.close();
    }
  }

  /**
   * Gets a single repository from connection manager.
   * 
   * @param target The target class or table name
   */
  public getRepository<Entity>(target: ObjectType<Entity> | EntitySchema<Entity> | string): Repository<Entity> {
    return this.connection.manager.getRepository(target as any) as any;
  }
}
