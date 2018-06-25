import * as winston from 'winston';
import * as Raven from 'raven';
import * as SentryTransport from 'winston-raven-sentry';

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

  static DEFAULT_TRANSPORTS: winston.TransportInstance[] = [
    new (winston.transports.Console)({
      // TODO: Get from default configuration layer
      level: process.env.LOG_LEVEL || 'silly',
      colorize: true,
    }),
  ];

  public constructor(options: SimpleLoggerOptions = {}) {
    // Prepare default console transport
    const opt = {
      transports: options.transports || SimpleLogger.DEFAULT_TRANSPORTS,
    };

    // Add sentry if available
    if (options.sentry) {
      opt.transports.push(new SentryTransport(options.sentry));
    }

    super(opt);
  }

  public static getInstance(): winston.LoggerInstance {
    if (!this.instance) {
      this.instance = new SimpleLogger();
    }
    return this.instance;
  }
}
