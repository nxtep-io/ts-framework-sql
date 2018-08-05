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
require("reflect-metadata");
const path = require("path");
const fs = require("fs");
const glob = require("glob");
const typeorm_1 = require("typeorm");
const ts_framework_common_1 = require("ts-framework-common");
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
exports.EntityDatabase = EntityDatabase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDRCQUEwQjtBQUMxQiw2QkFBNkI7QUFDN0IseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QixxQ0FHaUI7QUFJakIsNkRBQW9GO0FBVXBGLE1BQWEsY0FBZSxTQUFRLDhCQUFRO0lBTTFDOzs7O09BSUc7SUFDSCxZQUFtQixPQUE4QjtRQUMvQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFERSxZQUFPLEdBQVAsT0FBTyxDQUF1QjtRQVA5QixrQkFBYSxHQUF3QixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBVWhFLDhCQUE4QjtRQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFDckMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO0lBQ3BHLENBQUM7SUFFRDs7OztPQUlHO0lBQ1UsT0FBTzs7WUFDbEIsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLGlCQUF3QixDQUFDO1lBRTVGLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDZixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQzthQUN4RztZQUVELElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDbkIsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQ2pDO2lC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QU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3RDLENBQUM7Q0FDRjtBQS9JRCx3Q0ErSUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIGdsb2IgZnJvbSAnZ2xvYic7XG5pbXBvcnQge1xuICBjcmVhdGVDb25uZWN0aW9uLCBDb25uZWN0aW9uLCBDb25uZWN0aW9uT3B0aW9ucyxcbiAgT2JqZWN0VHlwZSwgRW50aXR5U2NoZW1hLCBSZXBvc2l0b3J5LCBCYXNlRW50aXR5LCBnZXRNZXRhZGF0YUFyZ3NTdG9yYWdlLFxufSBmcm9tICd0eXBlb3JtJztcbmltcG9ydCB7IE15c3FsQ29ubmVjdGlvbk9wdGlvbnMgfSBmcm9tICd0eXBlb3JtL2RyaXZlci9teXNxbC9NeXNxbENvbm5lY3Rpb25PcHRpb25zJztcbmltcG9ydCB7IFBvc3RncmVzQ29ubmVjdGlvbk9wdGlvbnMgfSBmcm9tICd0eXBlb3JtL2RyaXZlci9wb3N0Z3Jlcy9Qb3N0Z3Jlc0Nvbm5lY3Rpb25PcHRpb25zJztcbmltcG9ydCB7IFNxbGl0ZUNvbm5lY3Rpb25PcHRpb25zIH0gZnJvbSAndHlwZW9ybS9kcml2ZXIvc3FsaXRlL1NxbGl0ZUNvbm5lY3Rpb25PcHRpb25zJztcbmltcG9ydCB7IExvZ2dlciwgRGF0YWJhc2VPcHRpb25zLCBEYXRhYmFzZSwgQmFzZVNlcnZlciB9IGZyb20gJ3RzLWZyYW1ld29yay1jb21tb24nO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eURhdGFiYXNlT3B0aW9ucyBleHRlbmRzIERhdGFiYXNlT3B0aW9ucyB7XG4gIGxvZ2dlcj86IExvZ2dlcjtcbiAgY29ubmVjdGlvbj86IENvbm5lY3Rpb247XG4gIGNvbm5lY3Rpb25PcHRzPzogQ29ubmVjdGlvbk9wdGlvbnM7XG4gIGN1c3RvbVF1ZXJpZXNEaXI/OiBzdHJpbmc7XG4gIGVudGl0aWVzOiBhbnlbXTtcbn1cblxuZXhwb3J0IGNsYXNzIEVudGl0eURhdGFiYXNlIGV4dGVuZHMgRGF0YWJhc2Uge1xuICBwdWJsaWMgbG9nZ2VyOiBMb2dnZXI7XG4gIHByb3RlY3RlZCBjb25uZWN0aW9uOiBDb25uZWN0aW9uO1xuICBwcm90ZWN0ZWQgY29ubmVjdGlvbk9wdGlvbnM6IENvbm5lY3Rpb25PcHRpb25zO1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgY3VzdG9tUXVlcmllczogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBFbnRpdHkgZGF0YWJhc2UgZm9yIFNRTCBkcml2ZXJzLlxuICAgKiBcbiAgICogQHBhcmFtIGNvbm5lY3Rpb24gVGhlIFR5cGVPUk0gY29ubmVjdGlvbiB0byB0aGUgZGF0YWJhc2VcbiAgICovXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBvcHRpb25zOiBFbnRpdHlEYXRhYmFzZU9wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zKTtcblxuICAgIC8vIFRPRE86IEhhbmRsZSBjb25uZWN0aW9uIHVybFxuICAgIHRoaXMuY29ubmVjdGlvbiA9IG9wdGlvbnMuY29ubmVjdGlvbjtcbiAgICB0aGlzLmNvbm5lY3Rpb25PcHRpb25zID0gb3B0aW9ucy5jb25uZWN0aW9uID8gb3B0aW9ucy5jb25uZWN0aW9uLm9wdGlvbnMgOiBvcHRpb25zLmNvbm5lY3Rpb25PcHRzO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbm5lY3RzIHRvIHRoZSBkYXRhYmFzZSwgY3JlYXRpbmcgYSBjb25uZWN0aW9uIGluc3RhbmNlIGlmIG5vdCBhdmFpbGFibGUuXG4gICAqIFxuICAgKiBAcmV0dXJucyBBIHByb21pc2UgdG8gdGhlIGNvbm5lY3Rpb24gaW5zdGFuY2UuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgY29ubmVjdCgpOiBQcm9taXNlPEVudGl0eURhdGFiYXNlT3B0aW9ucz4ge1xuICAgIGNvbnN0IHsgdHlwZSwgaG9zdCwgcG9ydCwgdXNlcm5hbWUsIGRhdGFiYXNlLCBzeW5jaHJvbml6ZSB9ID0gdGhpcy5jb25uZWN0aW9uT3B0aW9ucyBhcyBhbnk7XG5cbiAgICBpZiAodGhpcy5sb2dnZXIpIHtcbiAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdDb25uZWN0aW5nIHRvIHRoZSBkYXRhYmFzZScsIHsgdHlwZSwgaG9zdCwgcG9ydCwgdXNlcm5hbWUsIGRhdGFiYXNlLCBzeW5jaHJvbml6ZSB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb25uZWN0aW9uKSB7XG4gICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uY29ubmVjdCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jb25uZWN0aW9uT3B0aW9ucykge1xuICAgICAgdGhpcy5jb25uZWN0aW9uID0gYXdhaXQgY3JlYXRlQ29ubmVjdGlvbih0aGlzLmNvbm5lY3Rpb25PcHRpb25zKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubG9nZ2VyKSB7XG4gICAgICB0aGlzLmxvZ2dlci5zaWxseShgU3VjY2Vzc2Z1bGx5IGNvbm5lY3RlZCB0byB0aGUgZGF0YWJhc2VgLCB7IGRhdGFiYXNlIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5vcHRpb25zO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgdGhlIGRhdGFiYXNlIG1vdW50aW5nIHJvdXRpbmVzLlxuICAgKi9cbiAgb25Nb3VudCgpOiB2b2lkIHtcbiAgICAvLyBMb2cgZW50aXRpZXMgaW5pdGlhbGl6YXRpb25cbiAgICBpZiAodGhpcy5sb2dnZXIgJiYgdGhpcy5jb25uZWN0aW9uT3B0aW9ucyAmJiB0aGlzLmNvbm5lY3Rpb25PcHRpb25zLmVudGl0aWVzKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb25PcHRpb25zLmVudGl0aWVzLm1hcCgoRW50aXR5OiBhbnkpID0+IHtcbiAgICAgICAgaWYgKEVudGl0eSAmJiBFbnRpdHkucHJvdG90eXBlICYmIEVudGl0eS5wcm90b3R5cGUuY29uc3RydWN0b3IpIHtcbiAgICAgICAgICB0aGlzLmxvZ2dlci5zaWxseShgUmVnaXN0ZXJpbmcgbW9kZWwgaW4gZGF0YWJhc2U6ICR7RW50aXR5LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5uYW1lfWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMubG9nZ2VyLndhcm4oYEludmFsaWQgbW9kZWwgcmVnaXN0ZXJlZCBpbiBkYXRhYmFzZTogJHtFbnRpdHl9YCwgRW50aXR5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gSWYgYXZhaWxhYmxlLCBjb250aW51ZSB3aXRoIGxvYWRpbmcgdGhlIGN1c3RvbSBxdWVyaWVzXG4gICAgaWYgKHRoaXMub3B0aW9ucy5jdXN0b21RdWVyaWVzRGlyKSB7XG4gICAgICB0aGlzLmxvYWRDdXN0b21RdWVyaWVzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIG1hcCBvZiB0aGUgZW50aXRpZXMgY3VycmVudGx5IHJlZ2lzdGVyZWQgaW4gdGhlIERhdGFiYXNlLlxuICAgKi9cbiAgZW50aXRpZXMoKSB7XG4gICAgaWYgKHRoaXMuY29ubmVjdGlvbk9wdGlvbnMgJiYgdGhpcy5jb25uZWN0aW9uT3B0aW9ucy5lbnRpdGllcykge1xuICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbk9wdGlvbnMuZW50aXRpZXNcbiAgICAgICAgLm1hcCgoRW50aXR5OiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAoRW50aXR5ICYmIEVudGl0eS5wcm90b3R5cGUgJiYgRW50aXR5LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgcmV0dXJuIHsgW0VudGl0eS5wcm90b3R5cGUuY29uc3RydWN0b3IubmFtZV06IEVudGl0eSB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLmZpbHRlcihhID0+ICEhYSlcbiAgICAgICAgLnJlZHVjZSgoYWdnciwgbmV4dCkgPT4gKHsgLi4uYWdnciwgLi4ubmV4dCB9KSwge30pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBkYXRhYmFzZSBjdXJyZW50IHN0YXRlLlxuICAgKi9cbiAgcHVibGljIGlzQ29ubmVjdGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24gJiYgdGhpcy5jb25uZWN0aW9uLmlzQ29ubmVjdGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc2Nvbm5lY3RzIGZyb20gZXhpc3RpbmcgY29ubmVjdGlvbiwgaWYgYW55LlxuICAgKi9cbiAgcHVibGljIGFzeW5jIGRpc2Nvbm5lY3QoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgeyB0eXBlLCBob3N0LCBwb3J0LCB1c2VybmFtZSwgZGF0YWJhc2UsIHN5bmNocm9uaXplIH0gPSB0aGlzLmNvbm5lY3Rpb25PcHRpb25zIGFzIGFueTtcbiAgICBpZiAodGhpcy5jb25uZWN0aW9uKSB7XG4gICAgICBpZiAodGhpcy5sb2dnZXIpIHtcbiAgICAgICAgLy8gVE9ETzogSGlkZSBhdXRoZW50aWNhdGlvbiBpbmZvcm1hdGlvblxuICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnRGlzY29ubmVjdGluZyBmcm9tIGRhdGFiYXNlJywgeyBob3N0LCBwb3J0LCB1c2VybmFtZSB9KTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IHRoaXMuY29ubmVjdGlvbi5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgc2luZ2xlIHJlcG9zaXRvcnkgZnJvbSBjb25uZWN0aW9uIG1hbmFnZXIuXG4gICAqIFxuICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgY2xhc3Mgb3IgdGFibGUgbmFtZVxuICAgKi9cbiAgcHVibGljIGdldFJlcG9zaXRvcnk8RW50aXR5Pih0YXJnZXQ6IE9iamVjdFR5cGU8RW50aXR5PiB8IEVudGl0eVNjaGVtYTxFbnRpdHk+IHwgc3RyaW5nKTogUmVwb3NpdG9yeTxFbnRpdHk+IHtcbiAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLm1hbmFnZXIuZ2V0UmVwb3NpdG9yeSh0YXJnZXQgYXMgYW55KSBhcyBhbnk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZXMgYSBwcmUgbG9hZGVkIHF1ZXJ5IGZyb20gdGhlIHF1ZXJpZXMgZGlyZWN0b3J5XG4gICAqIFRoZSBxdWVyeSBuYW1lIGlzIHJlbGF0aXZlIHRvIHRoZSBjdXN0b21RdWVyaWVzRGlyLCBzbyBpZiB5b3Ugc2F2ZWQgaW5cbiAgICogYHF1ZXJpZXMvdXNlci9saXN0LnNxbGAgdGhlbiwgdGhlIGlkZW50aWZpZXIgd2lsbCBgYmUgdXNlci9saXN0YFxuICAgKiBAcGFyYW0gbmFtZSBUaGUgaWRlbnRpZmllciBvZiB0aGUgcXVlcnkgdG8gYmUgZXhlY3V0ZWRcbiAgICogQHBhcmFtIHBhcmFtcyBBbnkgcGFyYW1zIGlmIG5lZWRlZCB0byBhZGQgdG8gdGhlIHF1ZXJ5XG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZXhlY3V0ZUN1c3RvbVF1ZXJ5PFQ+KG5hbWU6IHN0cmluZywgcGFyYW1zOiBhbnlbXSA9IFtdKTogUHJvbWlzZTxhbnkgfCBUPiB7XG4gICAgY29uc3QgcXVlcnkgPSB0aGlzLmN1c3RvbVF1ZXJpZXMuZ2V0KG5hbWUpO1xuICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24ucXVlcnkocXVlcnksIHBhcmFtcykgYXMgVCB8IGFueTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkcyBhbGwgY3VzdG9tIHF1ZXJpZXMgZnJvbSB0aGUgY3VzdG9tUXVlcmllc0RpciBwYXRoXG4gICAqL1xuICBwcml2YXRlIGxvYWRDdXN0b21RdWVyaWVzKCk6IHZvaWQge1xuICAgIGdsb2IocGF0aC5qb2luKHRoaXMub3B0aW9ucy5jdXN0b21RdWVyaWVzRGlyLCAnLi8qKi8qLnNxbCcpLCAoZXJyLCBtYXRjaGVzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKCdDb3VsZCBub3QgbG9hZCBjdXN0b20gcXVlcmllcyBkaXJlY3Rvcnk6ICcgKyBlcnIubWVzc2FnZSwgZXJyKTtcbiAgICAgIH1cbiAgICAgIG1hdGNoZXMuZm9yRWFjaChmaWxlUGF0aCA9PiB0aGlzLmxvYWRDdXN0b21RdWVyeShmaWxlUGF0aCkpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIGEgY3VzdG9tUXVlcnkgdG8gdGhlIG1lbW9yeVxuICAgKiBAcGFyYW0gZmlsZVBhdGggVGhlIGZpbGUgcGF0aCB0byBiZSBsb2FkZWQgaW4gbWVtb3J5XG4gICAqL1xuICBwcml2YXRlIGxvYWRDdXN0b21RdWVyeShmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgbG9jYXRpb24gPSBwYXRoLnJlbGF0aXZlKHRoaXMub3B0aW9ucy5jdXN0b21RdWVyaWVzRGlyLCBmaWxlUGF0aCk7XG4gICAgY29uc3QgbmFtZSA9IGxvY2F0aW9uLnNsaWNlKDAsIGxvY2F0aW9uLmxhc3RJbmRleE9mKCcuJykpO1xuICAgIGNvbnN0IHF1ZXJ5ID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoKS50b1N0cmluZygpO1xuICAgIHRoaXMuY3VzdG9tUXVlcmllcy5zZXQobmFtZSwgcXVlcnkpO1xuICB9XG59XG4iXX0=