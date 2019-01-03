import 'reflect-metadata';
import { Database, DatabaseOptions, LoggerInstance } from 'ts-framework-common';
import { Connection, ConnectionOptions, EntitySchema, ObjectType, Repository } from 'typeorm';
export interface EntityDatabaseOptions extends DatabaseOptions {
    logger?: LoggerInstance;
    connection?: Connection;
    connectionOpts?: ConnectionOptions;
    customQueriesDir?: string;
    entities: any[];
}
export default class EntityDatabase extends Database {
    options: EntityDatabaseOptions;
    logger: LoggerInstance;
    protected connection: Connection;
    protected connectionOptions: ConnectionOptions;
    protected readonly customQueries: Map<string, string>;
    /**
     * Creates a new Entity database for SQL drivers.
     *
     * @param connection The TypeORM connection to the database
     */
    constructor(options: EntityDatabaseOptions);
    /**
     * Connects to the database, creating a connection instance if not available.
     *
     * @returns A promise to the connection instance.
     */
    connect(): Promise<EntityDatabaseOptions>;
    /**
     * Executes a raw query in the database.
     */
    query(rawQuery: string, ...args: any[]): Promise<any>;
    /**
     * Handles the database mounting routines.
     */
    onMount(): void;
    /**
     * Gets the map of the entities currently registered in the Database.
     */
    entities(): {
        [x: number]: any;
    };
    /**
     * Gets the database current state.
     */
    isConnected(): boolean;
    /**
     * Disconnects from existing connection, if any.
     */
    disconnect(): Promise<void>;
    /**
     * Gets a single repository from connection manager.
     *
     * @param target The target class or table name
     */
    getRepository<Entity>(target: ObjectType<Entity> | EntitySchema<Entity> | string): Repository<Entity>;
    /**
     * Executes a pre loaded query from the queries directory
     * The query name is relative to the customQueriesDir, so if you saved in
     * `queries/user/list.sql` then, the identifier will `be user/list`
     * @param name The identifier of the query to be executed
     * @param params Any params if needed to add to the query
     */
    executeCustomQuery<T>(name: string, params?: any[]): Promise<any | T>;
    /**
     * Loads all custom queries from the customQueriesDir path
     */
    private loadCustomQueries;
    /**
     * Loads a customQuery to the memory
     * @param filePath The file path to be loaded in memory
     */
    private loadCustomQuery;
}
