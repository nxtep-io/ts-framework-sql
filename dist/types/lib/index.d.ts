import 'reflect-metadata';
import { Connection, ConnectionOptions } from 'typeorm';
import { Logger, DatabaseOptions, Database } from '../common';
export interface EntityDatabaseOptions extends DatabaseOptions {
    logger?: Logger;
    connection?: Connection;
    connectionOpts?: ConnectionOptions;
    entities: any[];
}
export declare class EntityDatabase implements Database {
    protected options: EntityDatabaseOptions;
    protected logger: Logger;
    protected connection: Connection;
    protected connectionOptions: ConnectionOptions;
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
}
