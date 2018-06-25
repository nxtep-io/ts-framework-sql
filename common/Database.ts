import Logger from './logger';

export interface DatabaseOptions {
  logger?: Logger;
}

export interface Database {

  connect(): Promise<DatabaseOptions>;

  disconnect(): Promise<void>;

  isReady(): boolean;
  
}
