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
class EntityDatabase {
    /**
     * Creates a new Entity database for SQL drivers.
     *
     * @param connection The TypeORM connection to the database
     */
    constructor(options) {
        this.options = options;
        this.customQueries = new Map();
        this.logger = options.logger || new ts_framework_common_1.Logger();
        // TODO: Handle connection url
        this.connection = options.connection;
        this.connectionOptions = options.connection ? options.connection.options : options.connectionOpts;
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
        if (options.customQueriesDir) {
            this.loadCustomQueries();
        }
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
     * Gets the database current state.
     */
    isReady() {
        return this.connection && this.connection.isConnected;
    }
    /**
     * Disconnects from existing connection, if any.
     */
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connection) {
                if (this.logger) {
                    // TODO: Hide authentication information
                    this.logger.debug('Disconnecting from database', this.connectionOptions);
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
                // Do something
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDRCQUEwQjtBQUMxQiw2QkFBNkI7QUFDN0IseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QixxQ0FBZ0g7QUFJaEgsNkRBQXdFO0FBVXhFO0lBTUU7Ozs7T0FJRztJQUNILFlBQXNCLE9BQThCO1FBQTlCLFlBQU8sR0FBUCxPQUFPLENBQXVCO1FBUGpDLGtCQUFhLEdBQXdCLElBQUksR0FBRyxFQUFFLENBQUM7UUFRaEUsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLElBQUksNEJBQU0sRUFBRSxDQUFDO1FBRTdDLDhCQUE4QjtRQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFDckMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO1FBRWxHLDhCQUE4QjtRQUM5QixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLGlCQUFpQixJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUU7WUFDNUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFXLEVBQUUsRUFBRTtnQkFDbEQsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRTtvQkFDOUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsa0NBQWtDLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7aUJBQzFGO3FCQUFNO29CQUNMLElBQUksQ0FBQyxNQUFNLENB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Q0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN4RSxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDMUQsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdEMsQ0FBQztDQUNGO0FBdkhELHdDQXVIQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCB7IGNyZWF0ZUNvbm5lY3Rpb24sIENvbm5lY3Rpb24sIENvbm5lY3Rpb25PcHRpb25zLCBPYmplY3RUeXBlLCBFbnRpdHlTY2hlbWEsIFJlcG9zaXRvcnkgfSBmcm9tICd0eXBlb3JtJztcbmltcG9ydCB7IE15c3FsQ29ubmVjdGlvbk9wdGlvbnMgfSBmcm9tICd0eXBlb3JtL2RyaXZlci9teXNxbC9NeXNxbENvbm5lY3Rpb25PcHRpb25zJztcbmltcG9ydCB7IFBvc3RncmVzQ29ubmVjdGlvbk9wdGlvbnMgfSBmcm9tICd0eXBlb3JtL2RyaXZlci9wb3N0Z3Jlcy9Qb3N0Z3Jlc0Nvbm5lY3Rpb25PcHRpb25zJztcbmltcG9ydCB7IFNxbGl0ZUNvbm5lY3Rpb25PcHRpb25zIH0gZnJvbSAndHlwZW9ybS9kcml2ZXIvc3FsaXRlL1NxbGl0ZUNvbm5lY3Rpb25PcHRpb25zJztcbmltcG9ydCB7IExvZ2dlciwgRGF0YWJhc2VPcHRpb25zLCBEYXRhYmFzZSB9IGZyb20gJ3RzLWZyYW1ld29yay1jb21tb24nO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eURhdGFiYXNlT3B0aW9ucyBleHRlbmRzIERhdGFiYXNlT3B0aW9ucyB7XG4gIGxvZ2dlcj86IExvZ2dlcjtcbiAgY29ubmVjdGlvbj86IENvbm5lY3Rpb247XG4gIGNvbm5lY3Rpb25PcHRzPzogQ29ubmVjdGlvbk9wdGlvbnM7XG4gIGN1c3RvbVF1ZXJpZXNEaXI/OiBzdHJpbmc7XG4gIGVudGl0aWVzOiBhbnlbXTtcbn1cblxuZXhwb3J0IGNsYXNzIEVudGl0eURhdGFiYXNlIGltcGxlbWVudHMgRGF0YWJhc2Uge1xuICBwcm90ZWN0ZWQgbG9nZ2VyOiBMb2dnZXI7XG4gIHByb3RlY3RlZCBjb25uZWN0aW9uOiBDb25uZWN0aW9uO1xuICBwcm90ZWN0ZWQgY29ubmVjdGlvbk9wdGlvbnM6IENvbm5lY3Rpb25PcHRpb25zO1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgY3VzdG9tUXVlcmllczogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBFbnRpdHkgZGF0YWJhc2UgZm9yIFNRTCBkcml2ZXJzLlxuICAgKiBcbiAgICogQHBhcmFtIGNvbm5lY3Rpb24gVGhlIFR5cGVPUk0gY29ubmVjdGlvbiB0byB0aGUgZGF0YWJhc2VcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBvcHRpb25zOiBFbnRpdHlEYXRhYmFzZU9wdGlvbnMpIHtcbiAgICB0aGlzLmxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyIHx8IG5ldyBMb2dnZXIoKTtcblxuICAgIC8vIFRPRE86IEhhbmRsZSBjb25uZWN0aW9uIHVybFxuICAgIHRoaXMuY29ubmVjdGlvbiA9IG9wdGlvbnMuY29ubmVjdGlvbjtcbiAgICB0aGlzLmNvbm5lY3Rpb25PcHRpb25zID0gb3B0aW9ucy5jb25uZWN0aW9uID8gb3B0aW9ucy5jb25uZWN0aW9uLm9wdGlvbnMgOiBvcHRpb25zLmNvbm5lY3Rpb25PcHRzO1xuXG4gICAgLy8gTG9nIGVudGl0aWVzIGluaXRpYWxpemF0aW9uXG4gICAgaWYgKHRoaXMubG9nZ2VyICYmIHRoaXMuY29ubmVjdGlvbk9wdGlvbnMgJiYgdGhpcy5jb25uZWN0aW9uT3B0aW9ucy5lbnRpdGllcykge1xuICAgICAgdGhpcy5jb25uZWN0aW9uT3B0aW9ucy5lbnRpdGllcy5tYXAoKEVudGl0eTogYW55KSA9PiB7XG4gICAgICAgIGlmIChFbnRpdHkgJiYgRW50aXR5LnByb3RvdHlwZSAmJiBFbnRpdHkucHJvdG90eXBlLmNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgdGhpcy5sb2dnZXIuc2lsbHkoYFJlZ2lzdGVyaW5nIG1vZGVsIGluIGRhdGFiYXNlOiAke0VudGl0eS5wcm90b3R5cGUuY29uc3RydWN0b3IubmFtZX1gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmxvZ2dlci53YXJuKGBJbnZhbGlkIG1vZGVsIHJlZ2lzdGVyZWQgaW4gZGF0YWJhc2U6ICR7RW50aXR5fWAsIEVudGl0eSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5jdXN0b21RdWVyaWVzRGlyKSB7XG4gICAgICB0aGlzLmxvYWRDdXN0b21RdWVyaWVzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbm5lY3RzIHRvIHRoZSBkYXRhYmFzZSwgY3JlYXRpbmcgYSBjb25uZWN0aW9uIGluc3RhbmNlIGlmIG5vdCBhdmFpbGFibGUuXG4gICAqIFxuICAgKiBAcmV0dXJucyBBIHByb21pc2UgdG8gdGhlIGNvbm5lY3Rpb24gaW5zdGFuY2UuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgY29ubmVjdCgpOiBQcm9taXNlPEVudGl0eURhdGFiYXNlT3B0aW9ucz4ge1xuICAgIGNvbnN0IHsgdHlwZSwgaG9zdCwgcG9ydCwgdXNlcm5hbWUsIGRhdGFiYXNlLCBzeW5jaHJvbml6ZSB9ID0gdGhpcy5jb25uZWN0aW9uT3B0aW9ucyBhcyBhbnk7XG5cbiAgICBpZiAodGhpcy5sb2dnZXIpIHtcbiAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdDb25uZWN0aW5nIHRvIHRoZSBkYXRhYmFzZScsIHsgdHlwZSwgaG9zdCwgcG9ydCwgdXNlcm5hbWUsIGRhdGFiYXNlLCBzeW5jaHJvbml6ZSB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb25uZWN0aW9uKSB7XG4gICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uY29ubmVjdCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jb25uZWN0aW9uT3B0aW9ucykge1xuICAgICAgdGhpcy5jb25uZWN0aW9uID0gYXdhaXQgY3JlYXRlQ29ubmVjdGlvbih0aGlzLmNvbm5lY3Rpb25PcHRpb25zKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubG9nZ2VyKSB7XG4gICAgICB0aGlzLmxvZ2dlci5zaWxseShgU3VjY2Vzc2Z1bGx5IGNvbm5lY3RlZCB0byB0aGUgZGF0YWJhc2VgLCB7IGRhdGFiYXNlIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5vcHRpb25zO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGRhdGFiYXNlIGN1cnJlbnQgc3RhdGUuXG4gICAqL1xuICBwdWJsaWMgaXNSZWFkeSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uICYmIHRoaXMuY29ubmVjdGlvbi5pc0Nvbm5lY3RlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNjb25uZWN0cyBmcm9tIGV4aXN0aW5nIGNvbm5lY3Rpb24sIGlmIGFueS5cbiAgICovXG4gIHB1YmxpYyBhc3luYyBkaXNjb25uZWN0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLmNvbm5lY3Rpb24pIHtcbiAgICAgIGlmICh0aGlzLmxvZ2dlcikge1xuICAgICAgICAvLyBUT0RPOiBIaWRlIGF1dGhlbnRpY2F0aW9uIGluZm9ybWF0aW9uXG4gICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdEaXNjb25uZWN0aW5nIGZyb20gZGF0YWJhc2UnLCB0aGlzLmNvbm5lY3Rpb25PcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IHRoaXMuY29ubmVjdGlvbi5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgc2luZ2xlIHJlcG9zaXRvcnkgZnJvbSBjb25uZWN0aW9uIG1hbmFnZXIuXG4gICAqIFxuICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgY2xhc3Mgb3IgdGFibGUgbmFtZVxuICAgKi9cbiAgcHVibGljIGdldFJlcG9zaXRvcnk8RW50aXR5Pih0YXJnZXQ6IE9iamVjdFR5cGU8RW50aXR5PiB8IEVudGl0eVNjaGVtYTxFbnRpdHk+IHwgc3RyaW5nKTogUmVwb3NpdG9yeTxFbnRpdHk+IHtcbiAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLm1hbmFnZXIuZ2V0UmVwb3NpdG9yeSh0YXJnZXQgYXMgYW55KSBhcyBhbnk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZXMgYSBwcmUgbG9hZGVkIHF1ZXJ5IGZyb20gdGhlIHF1ZXJpZXMgZGlyZWN0b3J5XG4gICAqIFRoZSBxdWVyeSBuYW1lIGlzIHJlbGF0aXZlIHRvIHRoZSBjdXN0b21RdWVyaWVzRGlyLCBzbyBpZiB5b3Ugc2F2ZWQgaW5cbiAgICogYHF1ZXJpZXMvdXNlci9saXN0LnNxbGAgdGhlbiwgdGhlIGlkZW50aWZpZXIgd2lsbCBgYmUgdXNlci9saXN0YFxuICAgKiBAcGFyYW0gbmFtZSBUaGUgaWRlbnRpZmllciBvZiB0aGUgcXVlcnkgdG8gYmUgZXhlY3V0ZWRcbiAgICogQHBhcmFtIHBhcmFtcyBBbnkgcGFyYW1zIGlmIG5lZWRlZCB0byBhZGQgdG8gdGhlIHF1ZXJ5XG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZXhlY3V0ZUN1c3RvbVF1ZXJ5PFQ+KG5hbWU6IHN0cmluZywgcGFyYW1zOiBhbnlbXSA9IFtdKTogUHJvbWlzZTxhbnkgfCBUPiB7XG4gICAgY29uc3QgcXVlcnkgPSB0aGlzLmN1c3RvbVF1ZXJpZXMuZ2V0KG5hbWUpO1xuICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24ucXVlcnkocXVlcnksIHBhcmFtcykgYXMgVCB8IGFueTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkcyBhbGwgY3VzdG9tIHF1ZXJpZXMgZnJvbSB0aGUgY3VzdG9tUXVlcmllc0RpciBwYXRoXG4gICAqL1xuICBwcml2YXRlIGxvYWRDdXN0b21RdWVyaWVzKCk6IHZvaWQge1xuICAgIGdsb2IocGF0aC5qb2luKHRoaXMub3B0aW9ucy5jdXN0b21RdWVyaWVzRGlyLCAnLi8qKi8qLnNxbCcpLCAoZXJyLCBtYXRjaGVzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIC8vIERvIHNvbWV0aGluZ1xuICAgICAgfVxuICAgICAgbWF0Y2hlcy5mb3JFYWNoKGZpbGVQYXRoID0+IHRoaXMubG9hZEN1c3RvbVF1ZXJ5KGZpbGVQYXRoKSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTG9hZHMgYSBjdXN0b21RdWVyeSB0byB0aGUgbWVtb3J5XG4gICAqIEBwYXJhbSBmaWxlUGF0aCBUaGUgZmlsZSBwYXRoIHRvIGJlIGxvYWRlZCBpbiBtZW1vcnlcbiAgICovXG4gIHByaXZhdGUgbG9hZEN1c3RvbVF1ZXJ5KGZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBsb2NhdGlvbiA9IHBhdGgucmVsYXRpdmUodGhpcy5vcHRpb25zLmN1c3RvbVF1ZXJpZXNEaXIsIGZpbGVQYXRoKTtcbiAgICBjb25zdCBuYW1lID0gbG9jYXRpb24uc2xpY2UoMCwgbG9jYXRpb24ubGFzdEluZGV4T2YoJy4nKSk7XG4gICAgY29uc3QgcXVlcnkgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgpLnRvU3RyaW5nKCk7XG4gICAgdGhpcy5jdXN0b21RdWVyaWVzLnNldChuYW1lLCBxdWVyeSk7XG4gIH1cbn1cbiJdfQ==