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
            e.map((Entity) => {
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
            const { type, host, port, username, database, synchronize } = this.connectionOptions;
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
     * Drops current database.
     */
    drop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connection) {
                return this.connection.dropDatabase();
            }
            throw new ts_framework_common_1.BaseError('Connection is not available for dropping schema ');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW50aXR5RGF0YWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvRW50aXR5RGF0YWJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0IsNkJBQTZCO0FBQzdCLDRCQUEwQjtBQUMxQiw2REFBMkY7QUFDM0YscUNBQWdIO0FBRWhILE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBVTNDLE1BQXFCLGNBQWUsU0FBUSw4QkFBUTtJQU1sRDs7OztPQUlHO0lBQ0gsWUFBbUIsT0FBOEI7UUFDL0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBREUsWUFBTyxHQUFQLE9BQU8sQ0FBdUI7UUFQOUIsa0JBQWEsR0FBd0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQVVoRSw4QkFBOEI7UUFDOUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQztJQUNwRyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNVLE9BQU87O1lBQ2xCLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxFQUFTLENBQUM7WUFDbEcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsNEJBQTRCLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7WUFFdkcsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNuQixNQUFNLElB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RCxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzlELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNLLGVBQWUsQ0FBQyxRQUFnQjtRQUN0QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDeEUsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzFELE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRDs7T0FFRztJQUNVLElBQUk7O1lBQ2YsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNuQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLENBQUM7YUFDdkM7WUFDRCxNQUFNLElBQUksK0JBQVMsQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO1FBQzFFLENBQUM7S0FBQTtJQUVEOztPQUVHO0lBQ0ksUUFBUTtRQUNiLHlCQUNLLEtBQUssQ0FBQyxRQUFRLEVBQUUsSUFDbkIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQ3BCLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTyxJQUN4QjtJQUNKLENBQUM7Q0FDRjtBQTNLRCxpQ0EyS0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgeyBCYXNlRXJyb3IsIERhdGFiYXNlLCBEYXRhYmFzZU9wdGlvbnMsIExvZ2dlckluc3RhbmNlIH0gZnJvbSAndHMtZnJhbWV3b3JrLWNvbW1vbic7XG5pbXBvcnQgeyBDb25uZWN0aW9uLCBDb25uZWN0aW9uT3B0aW9ucywgY3JlYXRlQ29ubmVjdGlvbiwgRW50aXR5U2NoZW1hLCBPYmplY3RUeXBlLCBSZXBvc2l0b3J5IH0gZnJvbSAndHlwZW9ybSc7XG5cbmNvbnN0IFBBQ0tBR0UgPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKTtcblxuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlEYXRhYmFzZU9wdGlvbnMgZXh0ZW5kcyBEYXRhYmFzZU9wdGlvbnMge1xuICBsb2dnZXI/OiBMb2dnZXJJbnN0YW5jZTtcbiAgY29ubmVjdGlvbj86IENvbm5lY3Rpb247XG4gIGNvbm5lY3Rpb25PcHRzPzogQ29ubmVjdGlvbk9wdGlvbnM7XG4gIGN1c3RvbVF1ZXJpZXNEaXI/OiBzdHJpbmc7XG4gIGVudGl0aWVzOiBhbnlbXTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW50aXR5RGF0YWJhc2UgZXh0ZW5kcyBEYXRhYmFzZSB7XG4gIHB1YmxpYyBsb2dnZXI6IExvZ2dlckluc3RhbmNlO1xuICBwcm90ZWN0ZWQgY29ubmVjdGlvbjogQ29ubmVjdGlvbjtcbiAgcHJvdGVjdGVkIGNvbm5lY3Rpb25PcHRpb25zOiBDb25uZWN0aW9uT3B0aW9ucztcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGN1c3RvbVF1ZXJpZXM6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgRW50aXR5IGRhdGFiYXNlIGZvciBTUUwgZHJpdmVycy5cbiAgICogXG4gICAqIEBwYXJhbSBjb25uZWN0aW9uIFRoZSBUeXBlT1JNIGNvbm5lY3Rpb24gdG8gdGhlIGRhdGFiYXNlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgb3B0aW9uczogRW50aXR5RGF0YWJhc2VPcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucyk7XG5cbiAgICAvLyBUT0RPOiBIYW5kbGUgY29ubmVjdGlvbiB1cmxcbiAgICB0aGlzLmNvbm5lY3Rpb24gPSBvcHRpb25zLmNvbm5lY3Rpb247XG4gICAgdGhpcy5jb25uZWN0aW9uT3B0aW9ucyA9IG9wdGlvbnMuY29ubmVjdGlvbiA/IG9wdGlvbnMuY29ubmVjdGlvbi5vcHRpb25zIDogb3B0aW9ucy5jb25uZWN0aW9uT3B0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25uZWN0cyB0byB0aGUgZGF0YWJhc2UsIGNyZWF0aW5nIGEgY29ubmVjdGlvbiBpbnN0YW5jZSBpZiBub3QgYXZhaWxhYmxlLlxuICAgKiBcbiAgICogQHJldHVybnMgQSBwcm9taXNlIHRvIHRoZSBjb25uZWN0aW9uIGluc3RhbmNlLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIGNvbm5lY3QoKTogUHJvbWlzZTxFbnRpdHlEYXRhYmFzZU9wdGlvbnM+IHtcbiAgICBjb25zdCB7IHR5cGUsIGhvc3QsIHBvcnQsIHVzZXJuYW1lLCBkYXRhYmFzZSwgc3luY2hyb25pemUgfSA9IHRoaXMuY29ubmVjdGlvbk9wdGlvbnMgfHwge30gYXMgYW55O1xuICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdDb25uZWN0aW5nIHRvIHRoZSBkYXRhYmFzZScsIHsgdHlwZSwgaG9zdCwgcG9ydCwgdXNlcm5hbWUsIGRhdGFiYXNlLCBzeW5jaHJvbml6ZSB9KTtcblxuICAgIGlmICh0aGlzLmNvbm5lY3Rpb24pIHtcbiAgICAgIGF3YWl0IHRoaXMuY29ubmVjdGlvbi5jb25uZWN0KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvbm5lY3Rpb25PcHRpb25zKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb24gPSBhd2FpdCBjcmVhdGVDb25uZWN0aW9uKHRoaXMuY29ubmVjdGlvbk9wdGlvbnMpO1xuICAgIH1cbiAgICB0aGlzLmxvZ2dlci5zaWxseShgU3VjY2Vzc2Z1bGx5IGNvbm5lY3RlZCB0byB0aGUgZGF0YWJhc2VgLCB7IGRhdGFiYXNlIH0pO1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZXMgYSByYXcgcXVlcnkgaW4gdGhlIGRhdGFiYXNlLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIHF1ZXJ5KHJhd1F1ZXJ5OiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKTogUHJvbWlzZTxhbnk+IHtcbiAgICBpZiAodGhpcy5jb25uZWN0aW9uICYmIHRoaXMuY29ubmVjdGlvbi5pc0Nvbm5lY3RlZCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5xdWVyeShyYXdRdWVyeSwgYXJncyk7XG4gICAgfVxuICAgIHRocm93IG5ldyBCYXNlRXJyb3IoJ0Nvbm5lY3Rpb24gaXMgbm90IGF2YWlsYWJsZSBmb3IgcXVlcnkgcnVubmVyJyk7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyB0aGUgZGF0YWJhc2UgbW91bnRpbmcgcm91dGluZXMuXG4gICAqL1xuICBvbk1vdW50KCk6IHZvaWQge1xuICAgIC8vIExvZyBlbnRpdGllcyBpbml0aWFsaXphdGlvblxuICAgIGlmICh0aGlzLmNvbm5lY3Rpb25PcHRpb25zICYmIHRoaXMuY29ubmVjdGlvbk9wdGlvbnMuZW50aXRpZXMpIHtcbiAgICAgIGNvbnN0IGU6IGFueVtdID0gdGhpcy5jb25uZWN0aW9uT3B0aW9ucy5lbnRpdGllcztcblxuICAgICAgZS5tYXAoKEVudGl0eTogYW55KSA9PiB7XG4gICAgICAgIGlmIChFbnRpdHkgJiYgRW50aXR5LnByb3RvdHlwZSAmJiBFbnRpdHkucHJvdG90eXBlLmNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgdGhpcy5sb2dnZXIuc2lsbHkoYFJlZ2lzdGVyaW5nIG1vZGVsIGluICR7dGhpcy5vcHRpb25zLm5hbWV9OiAke0VudGl0eS5wcm90b3R5cGUuY29uc3RydWN0b3IubmFtZX1gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmxvZ2dlci53YXJuKGBJbnZhbGlkIG1vZGVsIHJlZ2lzdGVyZWQgaW4gZGF0YWJhc2U6ICR7RW50aXR5fWAsIEVudGl0eSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIElmIGF2YWlsYWJsZSwgY29udGludWUgd2l0aCBsb2FkaW5nIHRoZSBjdXN0b20gcXVlcmllc1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY3VzdG9tUXVlcmllc0Rpcikge1xuICAgICAgdGhpcy5sb2FkQ3VzdG9tUXVlcmllcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBtYXAgb2YgdGhlIGVudGl0aWVzIGN1cnJlbnRseSByZWdpc3RlcmVkIGluIHRoZSBEYXRhYmFzZS5cbiAgICovXG4gIGVudGl0aWVzKCkge1xuICAgIGlmICh0aGlzLmNvbm5lY3Rpb25PcHRpb25zICYmIHRoaXMuY29ubmVjdGlvbk9wdGlvbnMuZW50aXRpZXMpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb25PcHRpb25zLmVudGl0aWVzXG4gICAgICAgIC5tYXAoKEVudGl0eTogYW55KSA9PiB7XG4gICAgICAgICAgaWYgKEVudGl0eSAmJiBFbnRpdHkucHJvdG90eXBlICYmIEVudGl0eS5wcm90b3R5cGUuY29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiB7IFtFbnRpdHkucHJvdG90eXBlLmNvbnN0cnVjdG9yLm5hbWVdOiBFbnRpdHkgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5maWx0ZXIoYSA9PiAhIWEpXG4gICAgICAgIC5yZWR1Y2UoKGFnZ3IsIG5leHQpID0+ICh7IC4uLmFnZ3IsIC4uLm5leHQgfSksIHt9KTtcbiAgICB9XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGRhdGFiYXNlIGN1cnJlbnQgc3RhdGUuXG4gICAqL1xuICBwdWJsaWMgaXNDb25uZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbiAmJiB0aGlzLmNvbm5lY3Rpb24uaXNDb25uZWN0ZWQ7XG4gIH1cblxuICAvKipcbiAgICogRGlzY29ubmVjdHMgZnJvbSBleGlzdGluZyBjb25uZWN0aW9uLCBpZiBhbnkuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZGlzY29ubmVjdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IHR5cGUsIGhvc3QsIHBvcnQsIHVzZXJuYW1lLCBkYXRhYmFzZSwgc3luY2hyb25pemUgfSA9IHRoaXMuY29ubmVjdGlvbk9wdGlvbnMgYXMgYW55O1xuICAgIGlmICh0aGlzLmNvbm5lY3Rpb24pIHtcbiAgICAgIGlmICh0aGlzLmxvZ2dlcikge1xuICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnRGlzY29ubmVjdGluZyBmcm9tIGRhdGFiYXNlJywgeyBuYW1lOiB0aGlzLm9wdGlvbnMubmFtZSwgaG9zdCwgcG9ydCwgdXNlcm5hbWUgfSk7XG4gICAgICB9XG4gICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHNpbmdsZSByZXBvc2l0b3J5IGZyb20gY29ubmVjdGlvbiBtYW5hZ2VyLlxuICAgKiBcbiAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IGNsYXNzIG9yIHRhYmxlIG5hbWVcbiAgICovXG4gIHB1YmxpYyBnZXRSZXBvc2l0b3J5PEVudGl0eT4odGFyZ2V0OiBPYmplY3RUeXBlPEVudGl0eT4gfCBFbnRpdHlTY2hlbWE8RW50aXR5PiB8IHN0cmluZyk6IFJlcG9zaXRvcnk8RW50aXR5PiB7XG4gICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5tYW5hZ2VyLmdldFJlcG9zaXRvcnkodGFyZ2V0IGFzIGFueSkgYXMgYW55O1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGVzIGEgcHJlIGxvYWRlZCBxdWVyeSBmcm9tIHRoZSBxdWVyaWVzIGRpcmVjdG9yeVxuICAgKiBUaGUgcXVlcnkgbmFtZSBpcyByZWxhdGl2ZSB0byB0aGUgY3VzdG9tUXVlcmllc0Rpciwgc28gaWYgeW91IHNhdmVkIGluXG4gICAqIGBxdWVyaWVzL3VzZXIvbGlzdC5zcWxgIHRoZW4sIHRoZSBpZGVudGlmaWVyIHdpbGwgYmUgYHVzZXIvbGlzdGBcbiAgICogQHBhcmFtIG5hbWUgVGhlIGlkZW50aWZpZXIgb2YgdGhlIHF1ZXJ5IHRvIGJlIGV4ZWN1dGVkXG4gICAqIEBwYXJhbSBwYXJhbXMgQW55IHBhcmFtcyBpZiBuZWVkZWQgdG8gYWRkIHRvIHRoZSBxdWVyeVxuICAgKi9cbiAgcHVibGljIGFzeW5jIGV4ZWN1dGVDdXN0b21RdWVyeTxUPihuYW1lOiBzdHJpbmcsIHBhcmFtczogYW55W10gPSBbXSk6IFByb21pc2U8YW55IHwgVD4ge1xuICAgIGNvbnN0IHF1ZXJ5ID0gdGhpcy5jdXN0b21RdWVyaWVzLmdldChuYW1lKTtcbiAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLnF1ZXJ5KHF1ZXJ5LCBwYXJhbXMpIGFzIFQgfCBhbnk7XG4gIH1cblxuICAvKipcbiAgICogTG9hZHMgYWxsIGN1c3RvbSBxdWVyaWVzIGZyb20gdGhlIGN1c3RvbVF1ZXJpZXNEaXIgcGF0aFxuICAgKi9cbiAgcHJpdmF0ZSBsb2FkQ3VzdG9tUXVlcmllcygpOiB2b2lkIHtcbiAgICBnbG9iKHBhdGguam9pbih0aGlzLm9wdGlvbnMuY3VzdG9tUXVlcmllc0RpciwgJy4vKiovKi5zcWwnKSwgKGVyciwgbWF0Y2hlcykgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcignQ291bGQgbm90IGxvYWQgY3VzdG9tIHF1ZXJpZXMgZGlyZWN0b3J5OiAnICsgZXJyLm1lc3NhZ2UsIGVycik7XG4gICAgICB9XG4gICAgICBtYXRjaGVzLmZvckVhY2goZmlsZVBhdGggPT4gdGhpcy5sb2FkQ3VzdG9tUXVlcnkoZmlsZVBhdGgpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkcyBhIGN1c3RvbVF1ZXJ5IHRvIHRoZSBtZW1vcnlcbiAgICogQHBhcmFtIGZpbGVQYXRoIFRoZSBmaWxlIHBhdGggdG8gYmUgbG9hZGVkIGluIG1lbW9yeVxuICAgKi9cbiAgcHJpdmF0ZSBsb2FkQ3VzdG9tUXVlcnkoZmlsZVBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IGxvY2F0aW9uID0gcGF0aC5yZWxhdGl2ZSh0aGlzLm9wdGlvbnMuY3VzdG9tUXVlcmllc0RpciwgZmlsZVBhdGgpO1xuICAgIGNvbnN0IG5hbWUgPSBsb2NhdGlvbi5zbGljZSgwLCBsb2NhdGlvbi5sYXN0SW5kZXhPZignLicpKTtcbiAgICBjb25zdCBxdWVyeSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCkudG9TdHJpbmcoKTtcbiAgICB0aGlzLmN1c3RvbVF1ZXJpZXMuc2V0KG5hbWUsIHF1ZXJ5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEcm9wcyBjdXJyZW50IGRhdGFiYXNlLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIGRyb3AoKTogUHJvbWlzZTxhbnk+IHtcbiAgICBpZiAodGhpcy5jb25uZWN0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLmRyb3BEYXRhYmFzZSgpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgQmFzZUVycm9yKCdDb25uZWN0aW9uIGlzIG5vdCBhdmFpbGFibGUgZm9yIGRyb3BwaW5nIHNjaGVtYSAnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGVudGl0eSBkYXRhYmFzZSBjb21wb25lbnQgZGVzY3JpcHRpb24uXG4gICAqL1xuICBwdWJsaWMgZGVzY3JpYmUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN1cGVyLmRlc2NyaWJlKCksXG4gICAgICBtb2R1bGU6IFBBQ0tBR0UubmFtZSxcbiAgICAgIHZlcnNpb246IFBBQ0tBR0UudmVyc2lvbixcbiAgICB9O1xuICB9XG59XG4iXX0=