"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const glob = require("glob");
const path = require("path");
require("reflect-metadata");
const ts_framework_common_1 = require("ts-framework-common");
const typeorm_1 = require("typeorm");
const PACKAGE = require('../package.json');
class EntityDatabase extends ts_framework_common_1.Database {
    /**
     * Creates a new Entity database for SQL drivers.
     *
     * @param connection The TypeORM connection to the database
     */
    constructor(options) {
        super(options);
        this.options = options;
        this.customQueries = new Map();
        // TODO: Handle connection url
        this.connection = options.connection;
        this.connectionOptions = options.connection ? options.connection.options : options.connectionOpts;
    }
    /**
     * Connects to the database, creating a connection instance if not available.
     *
     * @returns A promise to the connection instance.
     */
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const { type, host, port, username, database, synchronize } = this.connectionOptions || {};
            this.logger.debug('Connecting to the database', { type, host, port, username, database, synchronize });
            if (this.connection) {
                yield this.connection.connect();
            }
            else if (this.connectionOptions) {
                this.connection = yield typeorm_1.createConnection(this.connectionOptions);
            }
            this.logger.silly(`Successfully connected to the database`, { database });
            return this.options;
        });
    }
    /**
     * Executes a raw query in the database.
     */
    query(rawQuery, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connection && this.connection.isConnected) {
                return this.connection.query(rawQuery, args);
            }
            throw new ts_framework_common_1.BaseError('Connection is not available for query runner');
        });
    }
    /**
     * Handles the database mounting routines.
     */
    onMount() {
        // Log entities initialization
        if (this.connectionOptions && this.connectionOptions.entities) {
            const e = this.connectionOptions.entities;
            e.forEach((Entity) => {
                if (Entity && Entity.prototype && Entity.prototype.constructor) {
                    this.logger.silly(`Registering model in ${this.options.name}: ${Entity.prototype.constructor.name}`);
                }
                else {
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
                .map((Entity) => {
                if (Entity && Entity.prototype && Entity.prototype.constructor) {
                    return { [Entity.prototype.constructor.name]: Entity };
                }
            })
                .filter(a => !!a)
                .reduce((aggr, next) => (Object.assign({}, aggr, next)), {});
        }
        return {};
    }
    /**
     * Gets the database current state.
     */
    isConnected() {
        return this.connection && this.connection.isConnected;
    }
    /**
     * Disconnects from existing connection, if any.
     */
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            const { host, port, username } = this.connectionOptions;
            if (this.connection) {
                if (this.logger) {
                    this.logger.debug('Disconnecting from database', { name: this.options.name, host, port, username });
                }
                yield this.connection.close();
            }
        });
    }
    /**
     * Gets a single repository from connection manager.
     *
     * @param target The target class or table name
     */
    getRepository(target) {
        return this.connection.manager.getRepository(target);
    }
    /**
     * Executes a pre loaded query from the queries directory
     * The query name is relative to the customQueriesDir, so if you saved in
     * `queries/user/list.sql` then, the identifier will be `user/list`
     * @param name The identifier of the query to be executed
     * @param params Any params if needed to add to the query
     */
    executeCustomQuery(name, params = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.customQueries.get(name);
            return this.connection.query(query, params);
        });
    }
    /**
     * Loads all custom queries from the customQueriesDir path
     */
    loadCustomQueries() {
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
    loadCustomQuery(filePath) {
        const location = path.relative(this.options.customQueriesDir, filePath);
        const name = location.slice(0, location.lastIndexOf('.'));
        const query = fs.readFileSync(filePath).toString();
        this.customQueries.set(name, query);
    }
    /**
     * Drops current database schema.
     */
    drop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connection) {
                return this.connection.dropDatabase();
            }
            throw new ts_framework_common_1.BaseError('Connection is not available for dropping schema');
        });
    }
    /**
     * Migrates current database schema.
     */
    migrate(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connection) {
                return this.connection.runMigrations(options);
            }
            throw new ts_framework_common_1.BaseError('Connection is not available for migrating schema');
        });
    }
    /**
     * Gets entity database component description.
     */
    describe() {
        return Object.assign({}, super.describe(), { module: PACKAGE.name, version: PACKAGE.version });
    }
}
exports.default = EntityDatabase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW50aXR5RGF0YWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvRW50aXR5RGF0YWJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0IsNkJBQTZCO0FBQzdCLDRCQUEwQjtBQUMxQiw2REFBMkY7QUFDM0YscUNBQWdIO0FBRWhILE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBUzNDLE1BQXFCLGNBQWUsU0FBUSw4QkFBUTtJQU1sRDs7OztPQUlHO0lBQ0gsWUFBbUIsT0FBOEI7UUFDL0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBREUsWUFBTyxHQUFQLE9BQU8sQ0FBdUI7UUFQOUIsa0JBQWEsR0FBd0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQVVoRSw4QkFBOEI7UUFDOUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQztJQUNwRyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNVLE9BQU87O1lBQ2xCLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxFQUFTLENBQUM7WUFDbEcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsNEJBQTRCLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7WUFFdkcsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNuQixNQUFNLElB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QyxPQUFPLElBQ3hCO0lBQ0osQ0FBQztDQUNGO0FBckxELGlDQXFMQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIGdsb2IgZnJvbSAnZ2xvYic7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IEJhc2VFcnJvciwgRGF0YWJhc2UsIERhdGFiYXNlT3B0aW9ucywgTG9nZ2VySW5zdGFuY2UgfSBmcm9tICd0cy1mcmFtZXdvcmstY29tbW9uJztcbmltcG9ydCB7IENvbm5lY3Rpb24sIENvbm5lY3Rpb25PcHRpb25zLCBjcmVhdGVDb25uZWN0aW9uLCBFbnRpdHlTY2hlbWEsIE9iamVjdFR5cGUsIFJlcG9zaXRvcnkgfSBmcm9tICd0eXBlb3JtJztcblxuY29uc3QgUEFDS0FHRSA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eURhdGFiYXNlT3B0aW9ucyBleHRlbmRzIERhdGFiYXNlT3B0aW9ucyB7XG4gIGxvZ2dlcj86IExvZ2dlckluc3RhbmNlO1xuICBjb25uZWN0aW9uPzogQ29ubmVjdGlvbjtcbiAgY29ubmVjdGlvbk9wdHM/OiBDb25uZWN0aW9uT3B0aW9ucztcbiAgY3VzdG9tUXVlcmllc0Rpcj86IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW50aXR5RGF0YWJhc2UgZXh0ZW5kcyBEYXRhYmFzZSB7XG4gIHB1YmxpYyBsb2dnZXI6IExvZ2dlckluc3RhbmNlO1xuICBwcm90ZWN0ZWQgY29ubmVjdGlvbjogQ29ubmVjdGlvbjtcbiAgcHJvdGVjdGVkIGNvbm5lY3Rpb25PcHRpb25zOiBDb25uZWN0aW9uT3B0aW9ucztcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGN1c3RvbVF1ZXJpZXM6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgRW50aXR5IGRhdGFiYXNlIGZvciBTUUwgZHJpdmVycy5cbiAgICogXG4gICAqIEBwYXJhbSBjb25uZWN0aW9uIFRoZSBUeXBlT1JNIGNvbm5lY3Rpb24gdG8gdGhlIGRhdGFiYXNlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgb3B0aW9uczogRW50aXR5RGF0YWJhc2VPcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucyk7XG5cbiAgICAvLyBUT0RPOiBIYW5kbGUgY29ubmVjdGlvbiB1cmxcbiAgICB0aGlzLmNvbm5lY3Rpb24gPSBvcHRpb25zLmNvbm5lY3Rpb247XG4gICAgdGhpcy5jb25uZWN0aW9uT3B0aW9ucyA9IG9wdGlvbnMuY29ubmVjdGlvbiA/IG9wdGlvbnMuY29ubmVjdGlvbi5vcHRpb25zIDogb3B0aW9ucy5jb25uZWN0aW9uT3B0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25uZWN0cyB0byB0aGUgZGF0YWJhc2UsIGNyZWF0aW5nIGEgY29ubmVjdGlvbiBpbnN0YW5jZSBpZiBub3QgYXZhaWxhYmxlLlxuICAgKiBcbiAgICogQHJldHVybnMgQSBwcm9taXNlIHRvIHRoZSBjb25uZWN0aW9uIGluc3RhbmNlLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIGNvbm5lY3QoKTogUHJvbWlzZTxFbnRpdHlEYXRhYmFzZU9wdGlvbnM+IHtcbiAgICBjb25zdCB7IHR5cGUsIGhvc3QsIHBvcnQsIHVzZXJuYW1lLCBkYXRhYmFzZSwgc3luY2hyb25pemUgfSA9IHRoaXMuY29ubmVjdGlvbk9wdGlvbnMgfHwge30gYXMgYW55O1xuICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdDb25uZWN0aW5nIHRvIHRoZSBkYXRhYmFzZScsIHsgdHlwZSwgaG9zdCwgcG9ydCwgdXNlcm5hbWUsIGRhdGFiYXNlLCBzeW5jaHJvbml6ZSB9KTtcblxuICAgIGlmICh0aGlzLmNvbm5lY3Rpb24pIHtcbiAgICAgIGF3YWl0IHRoaXMuY29ubmVjdGlvbi5jb25uZWN0KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvbm5lY3Rpb25PcHRpb25zKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb24gPSBhd2FpdCBjcmVhdGVDb25uZWN0aW9uKHRoaXMuY29ubmVjdGlvbk9wdGlvbnMpO1xuICAgIH1cbiAgICB0aGlzLmxvZ2dlci5zaWxseShgU3VjY2Vzc2Z1bGx5IGNvbm5lY3RlZCB0byB0aGUgZGF0YWJhc2VgLCB7IGRhdGFiYXNlIH0pO1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZXMgYSByYXcgcXVlcnkgaW4gdGhlIGRhdGFiYXNlLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIHF1ZXJ5KHJhd1F1ZXJ5OiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKTogUHJvbWlzZTxhbnk+IHtcbiAgICBpZiAodGhpcy5jb25uZWN0aW9uICYmIHRoaXMuY29ubmVjdGlvbi5pc0Nvbm5lY3RlZCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5xdWVyeShyYXdRdWVyeSwgYXJncyk7XG4gICAgfVxuICAgIHRocm93IG5ldyBCYXNlRXJyb3IoJ0Nvbm5lY3Rpb24gaXMgbm90IGF2YWlsYWJsZSBmb3IgcXVlcnkgcnVubmVyJyk7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyB0aGUgZGF0YWJhc2UgbW91bnRpbmcgcm91dGluZXMuXG4gICAqL1xuICBvbk1vdW50KCk6IHZvaWQge1xuICAgIC8vIExvZyBlbnRpdGllcyBpbml0aWFsaXphdGlvblxuICAgIGlmICh0aGlzLmNvbm5lY3Rpb25PcHRpb25zICYmIHRoaXMuY29ubmVjdGlvbk9wdGlvbnMuZW50aXRpZXMpIHtcbiAgICAgIGNvbnN0IGU6IGFueVtdID0gdGhpcy5jb25uZWN0aW9uT3B0aW9ucy5lbnRpdGllcztcblxuICAgICAgZS5mb3JFYWNoKChFbnRpdHk6IGFueSkgPT4ge1xuICAgICAgICBpZiAoRW50aXR5ICYmIEVudGl0eS5wcm90b3R5cGUgJiYgRW50aXR5LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcikge1xuICAgICAgICAgIHRoaXMubG9nZ2VyLnNpbGx5KGBSZWdpc3RlcmluZyBtb2RlbCBpbiAke3RoaXMub3B0aW9ucy5uYW1lfTogJHtFbnRpdHkucHJvdG90eXBlLmNvbnN0cnVjdG9yLm5hbWV9YCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5sb2dnZXIud2FybihgSW52YWxpZCBtb2RlbCByZWdpc3RlcmVkIGluIGRhdGFiYXNlOiAke0VudGl0eX1gLCBFbnRpdHkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBJZiBhdmFpbGFibGUsIGNvbnRpbnVlIHdpdGggbG9hZGluZyB0aGUgY3VzdG9tIHF1ZXJpZXNcbiAgICBpZiAodGhpcy5vcHRpb25zLmN1c3RvbVF1ZXJpZXNEaXIpIHtcbiAgICAgIHRoaXMubG9hZEN1c3RvbVF1ZXJpZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbWFwIG9mIHRoZSBlbnRpdGllcyBjdXJyZW50bHkgcmVnaXN0ZXJlZCBpbiB0aGUgRGF0YWJhc2UuXG4gICAqL1xuICBlbnRpdGllcygpIHtcbiAgICBpZiAodGhpcy5jb25uZWN0aW9uT3B0aW9ucyAmJiB0aGlzLmNvbm5lY3Rpb25PcHRpb25zLmVudGl0aWVzKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uT3B0aW9ucy5lbnRpdGllc1xuICAgICAgICAubWFwKChFbnRpdHk6IGFueSkgPT4ge1xuICAgICAgICAgIGlmIChFbnRpdHkgJiYgRW50aXR5LnByb3RvdHlwZSAmJiBFbnRpdHkucHJvdG90eXBlLmNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4geyBbRW50aXR5LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5uYW1lXTogRW50aXR5IH07XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuZmlsdGVyKGEgPT4gISFhKVxuICAgICAgICAucmVkdWNlKChhZ2dyLCBuZXh0KSA9PiAoeyAuLi5hZ2dyLCAuLi5uZXh0IH0pLCB7fSk7XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBkYXRhYmFzZSBjdXJyZW50IHN0YXRlLlxuICAgKi9cbiAgcHVibGljIGlzQ29ubmVjdGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24gJiYgdGhpcy5jb25uZWN0aW9uLmlzQ29ubmVjdGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc2Nvbm5lY3RzIGZyb20gZXhpc3RpbmcgY29ubmVjdGlvbiwgaWYgYW55LlxuICAgKi9cbiAgcHVibGljIGFzeW5jIGRpc2Nvbm5lY3QoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgeyBob3N0LCBwb3J0LCB1c2VybmFtZSB9ID0gdGhpcy5jb25uZWN0aW9uT3B0aW9ucyBhcyBhbnk7XG4gICAgaWYgKHRoaXMuY29ubmVjdGlvbikge1xuICAgICAgaWYgKHRoaXMubG9nZ2VyKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdEaXNjb25uZWN0aW5nIGZyb20gZGF0YWJhc2UnLCB7IG5hbWU6IHRoaXMub3B0aW9ucy5uYW1lLCBob3N0LCBwb3J0LCB1c2VybmFtZSB9KTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IHRoaXMuY29ubmVjdGlvbi5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgc2luZ2xlIHJlcG9zaXRvcnkgZnJvbSBjb25uZWN0aW9uIG1hbmFnZXIuXG4gICAqIFxuICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgY2xhc3Mgb3IgdGFibGUgbmFtZVxuICAgKi9cbiAgcHVibGljIGdldFJlcG9zaXRvcnk8RW50aXR5Pih0YXJnZXQ6IE9iamVjdFR5cGU8RW50aXR5PiB8IEVudGl0eVNjaGVtYTxFbnRpdHk+IHwgc3RyaW5nKTogUmVwb3NpdG9yeTxFbnRpdHk+IHtcbiAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLm1hbmFnZXIuZ2V0UmVwb3NpdG9yeSh0YXJnZXQgYXMgYW55KSBhcyBhbnk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZXMgYSBwcmUgbG9hZGVkIHF1ZXJ5IGZyb20gdGhlIHF1ZXJpZXMgZGlyZWN0b3J5XG4gICAqIFRoZSBxdWVyeSBuYW1lIGlzIHJlbGF0aXZlIHRvIHRoZSBjdXN0b21RdWVyaWVzRGlyLCBzbyBpZiB5b3Ugc2F2ZWQgaW5cbiAgICogYHF1ZXJpZXMvdXNlci9saXN0LnNxbGAgdGhlbiwgdGhlIGlkZW50aWZpZXIgd2lsbCBiZSBgdXNlci9saXN0YFxuICAgKiBAcGFyYW0gbmFtZSBUaGUgaWRlbnRpZmllciBvZiB0aGUgcXVlcnkgdG8gYmUgZXhlY3V0ZWRcbiAgICogQHBhcmFtIHBhcmFtcyBBbnkgcGFyYW1zIGlmIG5lZWRlZCB0byBhZGQgdG8gdGhlIHF1ZXJ5XG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZXhlY3V0ZUN1c3RvbVF1ZXJ5PFQ+KG5hbWU6IHN0cmluZywgcGFyYW1zOiBhbnlbXSA9IFtdKTogUHJvbWlzZTxhbnkgfCBUPiB7XG4gICAgY29uc3QgcXVlcnkgPSB0aGlzLmN1c3RvbVF1ZXJpZXMuZ2V0KG5hbWUpO1xuICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24ucXVlcnkocXVlcnksIHBhcmFtcykgYXMgVCB8IGFueTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkcyBhbGwgY3VzdG9tIHF1ZXJpZXMgZnJvbSB0aGUgY3VzdG9tUXVlcmllc0RpciBwYXRoXG4gICAqL1xuICBwcml2YXRlIGxvYWRDdXN0b21RdWVyaWVzKCk6IHZvaWQge1xuICAgIGdsb2IocGF0aC5qb2luKHRoaXMub3B0aW9ucy5jdXN0b21RdWVyaWVzRGlyLCAnLi8qKi8qLnNxbCcpLCAoZXJyLCBtYXRjaGVzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKCdDb3VsZCBub3QgbG9hZCBjdXN0b20gcXVlcmllcyBkaXJlY3Rvcnk6ICcgKyBlcnIubWVzc2FnZSwgZXJyKTtcbiAgICAgIH1cbiAgICAgIG1hdGNoZXMuZm9yRWFjaChmaWxlUGF0aCA9PiB0aGlzLmxvYWRDdXN0b21RdWVyeShmaWxlUGF0aCkpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIGEgY3VzdG9tUXVlcnkgdG8gdGhlIG1lbW9yeVxuICAgKiBAcGFyYW0gZmlsZVBhdGggVGhlIGZpbGUgcGF0aCB0byBiZSBsb2FkZWQgaW4gbWVtb3J5XG4gICAqL1xuICBwcml2YXRlIGxvYWRDdXN0b21RdWVyeShmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgbG9jYXRpb24gPSBwYXRoLnJlbGF0aXZlKHRoaXMub3B0aW9ucy5jdXN0b21RdWVyaWVzRGlyLCBmaWxlUGF0aCk7XG4gICAgY29uc3QgbmFtZSA9IGxvY2F0aW9uLnNsaWNlKDAsIGxvY2F0aW9uLmxhc3RJbmRleE9mKCcuJykpO1xuICAgIGNvbnN0IHF1ZXJ5ID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoKS50b1N0cmluZygpO1xuICAgIHRoaXMuY3VzdG9tUXVlcmllcy5zZXQobmFtZSwgcXVlcnkpO1xuICB9XG5cbiAgLyoqXG4gICAqIERyb3BzIGN1cnJlbnQgZGF0YWJhc2Ugc2NoZW1hLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIGRyb3AoKTogUHJvbWlzZTxhbnk+IHtcbiAgICBpZiAodGhpcy5jb25uZWN0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLmRyb3BEYXRhYmFzZSgpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgQmFzZUVycm9yKCdDb25uZWN0aW9uIGlzIG5vdCBhdmFpbGFibGUgZm9yIGRyb3BwaW5nIHNjaGVtYScpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1pZ3JhdGVzIGN1cnJlbnQgZGF0YWJhc2Ugc2NoZW1hLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIG1pZ3JhdGUob3B0aW9uczogeyB0cmFuc2FjdGlvbj86IGJvb2xlYW4gfSA9IHt9KTogUHJvbWlzZTxhbnk+IHtcbiAgICBpZiAodGhpcy5jb25uZWN0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLnJ1bk1pZ3JhdGlvbnMob3B0aW9ucyk7XG4gICAgfVxuICAgIHRocm93IG5ldyBCYXNlRXJyb3IoJ0Nvbm5lY3Rpb24gaXMgbm90IGF2YWlsYWJsZSBmb3IgbWlncmF0aW5nIHNjaGVtYScpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgZW50aXR5IGRhdGFiYXNlIGNvbXBvbmVudCBkZXNjcmlwdGlvbi5cbiAgICovXG4gIHB1YmxpYyBkZXNjcmliZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3VwZXIuZGVzY3JpYmUoKSxcbiAgICAgIG1vZHVsZTogUEFDS0FHRS5uYW1lLFxuICAgICAgdmVyc2lvbjogUEFDS0FHRS52ZXJzaW9uLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==