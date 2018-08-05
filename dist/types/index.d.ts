import 'reflect-metadata';
import { Connection, ConnectionOptions, ObjectType, EntitySchema, Repository, BaseEntity } from 'typeorm';
import { Logger, DatabaseOptions, Database } from 'ts-framework-common';
export interface EntityDatabaseOptions extends DatabaseOptions {
    logger?: Logger;
    connection?: Connection;
    connectionOpts?: ConnectionOptions;
    customQueriesDir?: string;
    entities: any[];
}
export declare class EntityDatabase extends Database {
    options: EntityDatabaseOptions;
    logger: Logger;
    protected connection: Connection;
    protected entities: BaseEntity[];
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
     * Handles the database mounting routines.
     */
    onMount(): void;
    /**
     * Gets the database current state.
     */
    isReady(): boolean;
    /**
     * Describe database status and entities.
     */
    describe(): {
        name: string;
        isReady: boolean;
        entities: BaseEntity[];
    };
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
