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
            const { type, host, port, username, database, synchronize } = this.connectionOptions;
            if (this.logger) {
                this.logger.debug('Connecting to the database', { type, host, port, username, database, synchronize });
            }
            if (this.connection) {
                yield this.connection.connect();
            }
            else if (this.connectionOptions) {
                this.connection = yield typeorm_1.createConnection(this.connectionOptions);
            }
            if (this.logger) {
                this.logger.silly(`Successfully connected to the database`, { database });
            }
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
        if (this.logger && this.connectionOptions && this.connectionOptions.entities) {
            this.connectionOptions.entities.map((Entity) => {
                if (Entity && Entity.prototype && Entity.prototype.constructor) {
                    this.logger.silly(`Registering model in database: ${Entity.prototype.constructor.name}`);
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
                    // TODO: Hide authentication information
                    this.logger.debug('Disconnecting from database', { host, port, username });
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
     * `queries/user/list.sql` then, the identifier will `be user/list`
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
}
exports.default = EntityDatabase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW50aXR5RGF0YWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvRW50aXR5RGF0YWJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0IsNkJBQTZCO0FBQzdCLDRCQUEwQjtBQUMxQiw2REFBMkY7QUFDM0YscUNBQWdIO0FBVWhILE1BQXFCLGNBQWUsU0FBUSw4QkFBUTtJQU1sRDs7OztPQUlHO0lBQ0gsWUFBbUIsT0FBOEI7UUFDL0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBREUsWUFBTyxHQUFQLE9BQU8sQ0FBdUI7UUFQOUIsa0JBQWEsR0FBd0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQVVoRSw4QkFBOEI7UUFDOUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQztJQUNwRyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNVLE9BQU87O1lBQ2xCLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxpQkFBd0IsQ0FBQztZQUU1RixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsNEJBQTRCLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7YUFDeEc7WUFFRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ25CLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFP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QUFlLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUM5RCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7O09BR0c7SUFDSyxlQUFlLENBQUMsUUFBZ0I7UUFDdEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMxRCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ25ELElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN0QyxDQUFDO0NBQ0Y7QUExSkQsaUNBMEpDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0IHsgQmFzZUVycm9yLCBEYXRhYmFzZSwgRGF0YWJhc2VPcHRpb25zLCBMb2dnZXJJbnN0YW5jZSB9IGZyb20gJ3RzLWZyYW1ld29yay1jb21tb24nO1xuaW1wb3J0IHsgQ29ubmVjdGlvbiwgQ29ubmVjdGlvbk9wdGlvbnMsIGNyZWF0ZUNvbm5lY3Rpb24sIEVudGl0eVNjaGVtYSwgT2JqZWN0VHlwZSwgUmVwb3NpdG9yeSB9IGZyb20gJ3R5cGVvcm0nO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eURhdGFiYXNlT3B0aW9ucyBleHRlbmRzIERhdGFiYXNlT3B0aW9ucyB7XG4gIGxvZ2dlcj86IExvZ2dlckluc3RhbmNlO1xuICBjb25uZWN0aW9uPzogQ29ubmVjdGlvbjtcbiAgY29ubmVjdGlvbk9wdHM/OiBDb25uZWN0aW9uT3B0aW9ucztcbiAgY3VzdG9tUXVlcmllc0Rpcj86IHN0cmluZztcbiAgZW50aXRpZXM6IGFueVtdO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbnRpdHlEYXRhYmFzZSBleHRlbmRzIERhdGFiYXNlIHtcbiAgcHVibGljIGxvZ2dlcjogTG9nZ2VySW5zdGFuY2U7XG4gIHByb3RlY3RlZCBjb25uZWN0aW9uOiBDb25uZWN0aW9uO1xuICBwcm90ZWN0ZWQgY29ubmVjdGlvbk9wdGlvbnM6IENvbm5lY3Rpb25PcHRpb25zO1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgY3VzdG9tUXVlcmllczogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBFbnRpdHkgZGF0YWJhc2UgZm9yIFNRTCBkcml2ZXJzLlxuICAgKiBcbiAgICogQHBhcmFtIGNvbm5lY3Rpb24gVGhlIFR5cGVPUk0gY29ubmVjdGlvbiB0byB0aGUgZGF0YWJhc2VcbiAgICovXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBvcHRpb25zOiBFbnRpdHlEYXRhYmFzZU9wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zKTtcblxuICAgIC8vIFRPRE86IEhhbmRsZSBjb25uZWN0aW9uIHVybFxuICAgIHRoaXMuY29ubmVjdGlvbiA9IG9wdGlvbnMuY29ubmVjdGlvbjtcbiAgICB0aGlzLmNvbm5lY3Rpb25PcHRpb25zID0gb3B0aW9ucy5jb25uZWN0aW9uID8gb3B0aW9ucy5jb25uZWN0aW9uLm9wdGlvbnMgOiBvcHRpb25zLmNvbm5lY3Rpb25PcHRzO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbm5lY3RzIHRvIHRoZSBkYXRhYmFzZSwgY3JlYXRpbmcgYSBjb25uZWN0aW9uIGluc3RhbmNlIGlmIG5vdCBhdmFpbGFibGUuXG4gICAqIFxuICAgKiBAcmV0dXJucyBBIHByb21pc2UgdG8gdGhlIGNvbm5lY3Rpb24gaW5zdGFuY2UuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgY29ubmVjdCgpOiBQcm9taXNlPEVudGl0eURhdGFiYXNlT3B0aW9ucz4ge1xuICAgIGNvbnN0IHsgdHlwZSwgaG9zdCwgcG9ydCwgdXNlcm5hbWUsIGRhdGFiYXNlLCBzeW5jaHJvbml6ZSB9ID0gdGhpcy5jb25uZWN0aW9uT3B0aW9ucyBhcyBhbnk7XG5cbiAgICBpZiAodGhpcy5sb2dnZXIpIHtcbiAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdDb25uZWN0aW5nIHRvIHRoZSBkYXRhYmFzZScsIHsgdHlwZSwgaG9zdCwgcG9ydCwgdXNlcm5hbWUsIGRhdGFiYXNlLCBzeW5jaHJvbml6ZSB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb25uZWN0aW9uKSB7XG4gICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uY29ubmVjdCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jb25uZWN0aW9uT3B0aW9ucykge1xuICAgICAgdGhpcy5jb25uZWN0aW9uID0gYXdhaXQgY3JlYXRlQ29ubmVjdGlvbih0aGlzLmNvbm5lY3Rpb25PcHRpb25zKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubG9nZ2VyKSB7XG4gICAgICB0aGlzLmxvZ2dlci5zaWxseShgU3VjY2Vzc2Z1bGx5IGNvbm5lY3RlZCB0byB0aGUgZGF0YWJhc2VgLCB7IGRhdGFiYXNlIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5vcHRpb25zO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGVzIGEgcmF3IHF1ZXJ5IGluIHRoZSBkYXRhYmFzZS5cbiAgICovXG4gIHB1YmxpYyBhc3luYyBxdWVyeShyYXdRdWVyeTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSk6IFByb21pc2U8YW55PiB7XG4gICAgaWYgKHRoaXMuY29ubmVjdGlvbiAmJiB0aGlzLmNvbm5lY3Rpb24uaXNDb25uZWN0ZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24ucXVlcnkocmF3UXVlcnksIGFyZ3MpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgQmFzZUVycm9yKCdDb25uZWN0aW9uIGlzIG5vdCBhdmFpbGFibGUgZm9yIHF1ZXJ5IHJ1bm5lcicpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgdGhlIGRhdGFiYXNlIG1vdW50aW5nIHJvdXRpbmVzLlxuICAgKi9cbiAgb25Nb3VudCgpOiB2b2lkIHtcbiAgICAvLyBMb2cgZW50aXRpZXMgaW5pdGlhbGl6YXRpb25cbiAgICBpZiAodGhpcy5sb2dnZXIgJiYgdGhpcy5jb25uZWN0aW9uT3B0aW9ucyAmJiB0aGlzLmNvbm5lY3Rpb25PcHRpb25zLmVudGl0aWVzKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb25PcHRpb25zLmVudGl0aWVzLm1hcCgoRW50aXR5OiBhbnkpID0+IHtcbiAgICAgICAgaWYgKEVudGl0eSAmJiBFbnRpdHkucHJvdG90eXBlICYmIEVudGl0eS5wcm90b3R5cGUuY29uc3RydWN0b3IpIHtcbiAgICAgICAgICB0aGlzLmxvZ2dlci5zaWxseShgUmVnaXN0ZXJpbmcgbW9kZWwgaW4gZGF0YWJhc2U6ICR7RW50aXR5LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5uYW1lfWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMubG9nZ2VyLndhcm4oYEludmFsaWQgbW9kZWwgcmVnaXN0ZXJlZCBpbiBkYXRhYmFzZTogJHtFbnRpdHl9YCwgRW50aXR5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gSWYgYXZhaWxhYmxlLCBjb250aW51ZSB3aXRoIGxvYWRpbmcgdGhlIGN1c3RvbSBxdWVyaWVzXG4gICAgaWYgKHRoaXMub3B0aW9ucy5jdXN0b21RdWVyaWVzRGlyKSB7XG4gICAgICB0aGlzLmxvYWRDdXN0b21RdWVyaWVzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIG1hcCBvZiB0aGUgZW50aXRpZXMgY3VycmVudGx5IHJlZ2lzdGVyZWQgaW4gdGhlIERhdGFiYXNlLlxuICAgKi9cbiAgZW50aXRpZXMoKSB7XG4gICAgaWYgKHRoaXMuY29ubmVjdGlvbk9wdGlvbnMgJiYgdGhpcy5jb25uZWN0aW9uT3B0aW9ucy5lbnRpdGllcykge1xuICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbk9wdGlvbnMuZW50aXRpZXNcbiAgICAgICAgLm1hcCgoRW50aXR5OiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAoRW50aXR5ICYmIEVudGl0eS5wcm90b3R5cGUgJiYgRW50aXR5LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgcmV0dXJuIHsgW0VudGl0eS5wcm90b3R5cGUuY29uc3RydWN0b3IubmFtZV06IEVudGl0eSB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLmZpbHRlcihhID0+ICEhYSlcbiAgICAgICAgLnJlZHVjZSgoYWdnciwgbmV4dCkgPT4gKHsgLi4uYWdnciwgLi4ubmV4dCB9KSwge30pO1xuICAgIH1cbiAgICByZXR1cm4ge307XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZGF0YWJhc2UgY3VycmVudCBzdGF0ZS5cbiAgICovXG4gIHB1YmxpYyBpc0Nvbm5lY3RlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uICYmIHRoaXMuY29ubmVjdGlvbi5pc0Nvbm5lY3RlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNjb25uZWN0cyBmcm9tIGV4aXN0aW5nIGNvbm5lY3Rpb24sIGlmIGFueS5cbiAgICovXG4gIHB1YmxpYyBhc3luYyBkaXNjb25uZWN0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHsgdHlwZSwgaG9zdCwgcG9ydCwgdXNlcm5hbWUsIGRhdGFiYXNlLCBzeW5jaHJvbml6ZSB9ID0gdGhpcy5jb25uZWN0aW9uT3B0aW9ucyBhcyBhbnk7XG4gICAgaWYgKHRoaXMuY29ubmVjdGlvbikge1xuICAgICAgaWYgKHRoaXMubG9nZ2VyKSB7XG4gICAgICAgIC8vIFRPRE86IEhpZGUgYXV0aGVudGljYXRpb24gaW5mb3JtYXRpb25cbiAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ0Rpc2Nvbm5lY3RpbmcgZnJvbSBkYXRhYmFzZScsIHsgaG9zdCwgcG9ydCwgdXNlcm5hbWUgfSk7XG4gICAgICB9XG4gICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHNpbmdsZSByZXBvc2l0b3J5IGZyb20gY29ubmVjdGlvbiBtYW5hZ2VyLlxuICAgKiBcbiAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IGNsYXNzIG9yIHRhYmxlIG5hbWVcbiAgICovXG4gIHB1YmxpYyBnZXRSZXBvc2l0b3J5PEVudGl0eT4odGFyZ2V0OiBPYmplY3RUeXBlPEVudGl0eT4gfCBFbnRpdHlTY2hlbWE8RW50aXR5PiB8IHN0cmluZyk6IFJlcG9zaXRvcnk8RW50aXR5PiB7XG4gICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5tYW5hZ2VyLmdldFJlcG9zaXRvcnkodGFyZ2V0IGFzIGFueSkgYXMgYW55O1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGVzIGEgcHJlIGxvYWRlZCBxdWVyeSBmcm9tIHRoZSBxdWVyaWVzIGRpcmVjdG9yeVxuICAgKiBUaGUgcXVlcnkgbmFtZSBpcyByZWxhdGl2ZSB0byB0aGUgY3VzdG9tUXVlcmllc0Rpciwgc28gaWYgeW91IHNhdmVkIGluXG4gICAqIGBxdWVyaWVzL3VzZXIvbGlzdC5zcWxgIHRoZW4sIHRoZSBpZGVudGlmaWVyIHdpbGwgYGJlIHVzZXIvbGlzdGBcbiAgICogQHBhcmFtIG5hbWUgVGhlIGlkZW50aWZpZXIgb2YgdGhlIHF1ZXJ5IHRvIGJlIGV4ZWN1dGVkXG4gICAqIEBwYXJhbSBwYXJhbXMgQW55IHBhcmFtcyBpZiBuZWVkZWQgdG8gYWRkIHRvIHRoZSBxdWVyeVxuICAgKi9cbiAgcHVibGljIGFzeW5jIGV4ZWN1dGVDdXN0b21RdWVyeTxUPihuYW1lOiBzdHJpbmcsIHBhcmFtczogYW55W10gPSBbXSk6IFByb21pc2U8YW55IHwgVD4ge1xuICAgIGNvbnN0IHF1ZXJ5ID0gdGhpcy5jdXN0b21RdWVyaWVzLmdldChuYW1lKTtcbiAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLnF1ZXJ5KHF1ZXJ5LCBwYXJhbXMpIGFzIFQgfCBhbnk7XG4gIH1cblxuICAvKipcbiAgICogTG9hZHMgYWxsIGN1c3RvbSBxdWVyaWVzIGZyb20gdGhlIGN1c3RvbVF1ZXJpZXNEaXIgcGF0aFxuICAgKi9cbiAgcHJpdmF0ZSBsb2FkQ3VzdG9tUXVlcmllcygpOiB2b2lkIHtcbiAgICBnbG9iKHBhdGguam9pbih0aGlzLm9wdGlvbnMuY3VzdG9tUXVlcmllc0RpciwgJy4vKiovKi5zcWwnKSwgKGVyciwgbWF0Y2hlcykgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcignQ291bGQgbm90IGxvYWQgY3VzdG9tIHF1ZXJpZXMgZGlyZWN0b3J5OiAnICsgZXJyLm1lc3NhZ2UsIGVycik7XG4gICAgICB9XG4gICAgICBtYXRjaGVzLmZvckVhY2goZmlsZVBhdGggPT4gdGhpcy5sb2FkQ3VzdG9tUXVlcnkoZmlsZVBhdGgpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkcyBhIGN1c3RvbVF1ZXJ5IHRvIHRoZSBtZW1vcnlcbiAgICogQHBhcmFtIGZpbGVQYXRoIFRoZSBmaWxlIHBhdGggdG8gYmUgbG9hZGVkIGluIG1lbW9yeVxuICAgKi9cbiAgcHJpdmF0ZSBsb2FkQ3VzdG9tUXVlcnkoZmlsZVBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IGxvY2F0aW9uID0gcGF0aC5yZWxhdGl2ZSh0aGlzLm9wdGlvbnMuY3VzdG9tUXVlcmllc0RpciwgZmlsZVBhdGgpO1xuICAgIGNvbnN0IG5hbWUgPSBsb2NhdGlvbi5zbGljZSgwLCBsb2NhdGlvbi5sYXN0SW5kZXhPZignLicpKTtcbiAgICBjb25zdCBxdWVyeSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCkudG9TdHJpbmcoKTtcbiAgICB0aGlzLmN1c3RvbVF1ZXJpZXMuc2V0KG5hbWUsIHF1ZXJ5KTtcbiAgfVxufVxuIl19