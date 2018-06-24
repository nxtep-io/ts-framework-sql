import { Logger } from 'ts-framework';
import { createConnection, getConnectionOptions, Connection } from 'typeorm';

export default class EntityDB {
  static getInstance(): any {
    return new EntityDB();
  }

  /**
   * Connects to the entities DB.
   */
  public async connect(): Promise<Connection> {
    // Let's be really sure we won't change the DB schema on production
    const connectionOptions = await getConnectionOptions();
    
    if (process.env.NODE_ENV === 'production') {
      Object.assign(connectionOptions, { synchronize: false });
    }

    const connection = await createConnection(connectionOptions);

    // TODO: Better logging
    Logger.info(`Successfully connected to the database`, { db: connection.options.database });

    return connection;
  }
}
