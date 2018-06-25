/// <reference types="winston" />
import * as winston from 'winston';
import * as Raven from 'raven';
export interface SentryTransportOptions extends Raven.ConstructorOptions {
    dsn: string;
    level?: string;
    levelsMap?: any;
    install?: boolean;
    raven?: Raven.Client;
}
export interface SimpleLoggerOptions extends winston.LoggerOptions {
    sentry?: SentryTransportOptions;
    transports?: winston.TransportInstance[];
}
export default class SimpleLogger extends winston.Logger {
    protected static instance: SimpleLogger;
    static DEFAULT_TRANSPORTS: winston.TransportInstance[];
    constructor(options?: SimpleLoggerOptions);
    static getInstance(): winston.LoggerInstance;
}
