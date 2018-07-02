import 'reflect-metadata';
import { createConnection, Connection, ConnectionOptions, ObjectType, EntitySchema, Repository } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { Logger, DatabaseOptions, Database } from '../common';
import * as path from 'path';
import * as fs from 'fs';
import * as glob from 'glob';

export interface EntityDatabaseOptions extends DatabaseOptions {
  logger?: Logger;
  connection?: Connection;
  connectionOpts?: ConnectionOptions;
  customQueriesDir?: string;
  entities: any[];
}

export class EntityDatabase implements Database {
  protected logger: Logger;
  protected connection: Connection;
  protected connectionOptions: ConnectionOptions;
  protected readonly customQueries: Map<string, string> = new Map();

  /**
   * Creates a new Entity database for SQL drivers.
   * 
   * @param connection The TypeORM connection to the database
   */
  constructor(protected options: EntityDatabaseOptions) {
    this.logger = options.logger || new Logger();

    // TODO: Handle connection url
    this.connection = options.connection;
    this.connectionOptions = options.connection ? options.connection.options : options.connectionOpts;

    // Log entities initialization
    if (this.logger && this.connectionOptions && this.connectionOptions.entities) {
      this.connectionOptions.entities.map((Entity: any) => {
        this.logger.silly(`Registering model in database: ${Entity.prototype.constructor.name}`);
      });
    }
    if (options.customQueriesDir) {
      this.loadCustomQueries();
    }
  }

  /**
   * Connects to the database, creating a connection instance if not available.
   * 
   * @returns A promise to the connection instance.
   */
  public async connect(): Promise<EntityDatabaseOptions> {
    const { type, host, port, username, database, synchronize } = this.connectionOptions as any;

    if (this.logger) {
      this.logger.debug('Connecting to the database', { type, host, port, username, database, synchronize });
    }

    if (this.connection) {
      await this.connection.connect();
    } else if (this.connectionOptions) {
      this.connection = await createConnection(this.connectionOptions);
    }
    if (this.logger) {
      this.logger.silly(`Successfully connected to the database`, { database });
    }
    return this.options;
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

  public async executeCustomQuery<T>(name: string, params: any[] = []): Promise<any|T> {
    const query = this.customQueries.get(name);
    return this.connection.query(query, params) as T|any;
  }

  private loadCustomQueries(): void {
    glob(path.join(this.options.customQueriesDir, './**/*.sql'), (err, matches) => {
      if (err) {
        // Do something
      }
      matches.forEach(filePath => this.loadCustomQuery(filePath));
    });
  }

  private loadCustomQuery(filePath: string) {
    const location = path.relative(this.options.customQueriesDir, filePath);
    const name = location.slice(0, location.lastIndexOf('.'));
    const query = fs.readFileSync(filePath).toString();
    this.logger.silly(`${name} was added with ${query}`);
    this.customQueries.set(name, query);
  }
}
