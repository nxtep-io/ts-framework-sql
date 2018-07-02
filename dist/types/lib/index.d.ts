import 'reflect-metadata';
import { Connection, ConnectionOptions, ObjectType, EntitySchema, Repository } from 'typeorm';
import { Logger, DatabaseOptions, Database } from '../common';
export interface EntityDatabaseOptions extends DatabaseOptions {
    logger?: Logger;
    connection?: Connection;
    connectionOpts?: ConnectionOptions;
    customQueriesDir?: string;
    entities: any[];
}
export declare class EntityDatabase implements Database {
    protected options: EntityDatabaseOptions;
    protected logger: Logger;
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
     * Gets the database current state.
     */
    isReady(): boolean;
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
    executeCustomQuery<T>(name: string, params?: any[]): Promise<any | T>;
    private loadCustomQueries();
    private loadCustomQuery(filePath);
}
