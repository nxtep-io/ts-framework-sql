import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import 'reflect-metadata';
import { BaseError, Database, DatabaseOptions, LoggerInstance } from 'ts-framework-common';
import { Connection, ConnectionOptions, createConnection, EntitySchema, ObjectType, Repository } from 'typeorm';

export interface EntityDatabaseOptions extends DatabaseOptions {
  logger?: LoggerInstance;
  connection?: Connection;
  connectionOpts?: ConnectionOptions;
  customQueriesDir?: string;
  entities: any[];
}

export default class EntityDatabase extends Database {
  public logger: LoggerInstance;
  protected connection: Connection;
  protected connectionOptions: ConnectionOptions;
  protected readonly customQueries: Map<string, string> = new Map();

  /**
   * Creates a new Entity database for SQL drivers.
   * 
   * @param connection The TypeORM connection to the database
   */
  constructor(public options: EntityDatabaseOptions) {
    super(options);

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
   * Executes a raw query in the database.
   */
  public async query(rawQuery: string, ...args: any[]): Promise<any> {
    if (this.connection && this.connection.isConnected) {
      return this.connection.query(rawQuery, args);
    }
    throw new BaseError('Connection is not available for query runner');
  }

  /**
   * Handles the database mounting routines.
   */
  onMount(): void {
    // Log entities initialization
    if (this.logger && this.connectionOptions && this.connectionOptions.entities) {
      this.connectionOptions.entities.map((Entity: any) => {
        if (Entity && Entity.prototype && Entity.prototype.constructor) {
          this.logger.silly(`Registering model in database: ${Entity.prototype.constructor.name}`);
        } else {
          this.logger.warn(`Invalid model registered in database: ${Entity}`, Entity);
        }
      });
    }

    // If available, continue with loading the custom queries
    if (this.options.customQueriesDir) {
      this.loadCustomQueries();
    }
  }

  /**
   * Gets the map of the entities currently registered in the Database.
   */
  entities() {
    if (this.connectionOptions && this.connectionOptions.entities) {
      return this.connectionOptions.entities
        .map((Entity: any) => {
          if (Entity && Entity.prototype && Entity.prototype.constructor) {
            return { [Entity.prototype.constructor.name]: Entity };
          }
        })
        .filter(a => !!a)
        .reduce((aggr, next) => ({ ...aggr, ...next }), {});
    }
    return {};
  }

  /**
   * Gets the database current state.
   */
  public isConnected(): boolean {
    return this.connection && this.connection.isConnected;
  }

  /**
   * Disconnects from existing connection, if any.
   */
  public async disconnect(): Promise<void> {
    const { type, host, port, username, database, synchronize } = this.connectionOptions as any;
    if (this.connection) {
      if (this.logger) {
        // TODO: Hide authentication information
        this.logger.debug('Disconnecting from database', { host, port, username });
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

  /**
   * Executes a pre loaded query from the queries directory
   * The query name is relative to the customQueriesDir, so if you saved in
   * `queries/user/list.sql` then, the identifier will `be user/list`
   * @param name The identifier of the query to be executed
   * @param params Any params if needed to add to the query
   */
  public async executeCustomQuery<T>(name: string, params: any[] = []): Promise<any | T> {
    const query = this.customQueries.get(name);
    return this.connection.query(query, params) as T | any;
  }

  /**
   * Loads all custom queries from the customQueriesDir path
   */
  private loadCustomQueries(): void {
    glob(path.join(this.options.customQueriesDir, './**/*.sql'), (err, matches) => {
      if (err) {
        this.logger.error('Could not load custom queries directory: ' + err.message, err);
      }
      matches.forEach(filePath => this.loadCustomQuery(filePath));
    });
  }

  /**
   * Loads a customQuery to the memory
   * @param filePath The file path to be loaded in memory
   */
  private loadCustomQuery(filePath: string) {
    const location = path.relative(this.options.customQueriesDir, filePath);
    const name = location.slice(0, location.lastIndexOf('.'));
    const query = fs.readFileSync(filePath).toString();
    this.customQueries.set(name, query);
  }
}
