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
const fs = require("fs");
const glob = require("glob");
const path = require("path");
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
exports.EntityDatabase = EntityDatabase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDRCQUEwQjtBQUMxQix5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLDZCQUE2QjtBQUM3Qiw2REFBZ0Y7QUFDaEYscUNBQWdIO0FBVWhILE1BQWEsY0FBZSxTQUFRLDhCQUFRO0lBTTFDOzs7O09BSUc7SUFDSCxZQUFtQixPQUE4QjtRQUMvQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFERSxZQUFPLEdBQVAsT0FBTyxDQUF1QjtRQVA5QixrQkFBYSxHQUF3QixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBVWhFLDhCQUE4QjtRQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFDckMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO0lBQ3BHLENBQUM7SUFFRDs7OztPQUlHO0lBQ1UsT0FBTzs7WUFDbEIsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLGlCQUF3QixDQUFDO1lBRTVGLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDZixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQzthQUN4RztZQUVELElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDbkIsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQ2pDO2lC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QyxDQUFDLENBQUM7UUFDMUQsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdEMsQ0FBQztDQUNGO0FBaEpELHdDQWdKQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IERhdGFiYXNlLCBEYXRhYmFzZU9wdGlvbnMsIExvZ2dlckluc3RhbmNlIH0gZnJvbSAndHMtZnJhbWV3b3JrLWNvbW1vbic7XG5pbXBvcnQgeyBDb25uZWN0aW9uLCBDb25uZWN0aW9uT3B0aW9ucywgY3JlYXRlQ29ubmVjdGlvbiwgRW50aXR5U2NoZW1hLCBPYmplY3RUeXBlLCBSZXBvc2l0b3J5IH0gZnJvbSAndHlwZW9ybSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5RGF0YWJhc2VPcHRpb25zIGV4dGVuZHMgRGF0YWJhc2VPcHRpb25zIHtcbiAgbG9nZ2VyPzogTG9nZ2VySW5zdGFuY2U7XG4gIGNvbm5lY3Rpb24/OiBDb25uZWN0aW9uO1xuICBjb25uZWN0aW9uT3B0cz86IENvbm5lY3Rpb25PcHRpb25zO1xuICBjdXN0b21RdWVyaWVzRGlyPzogc3RyaW5nO1xuICBlbnRpdGllczogYW55W107XG59XG5cbmV4cG9ydCBjbGFzcyBFbnRpdHlEYXRhYmFzZSBleHRlbmRzIERhdGFiYXNlIHtcbiAgcHVibGljIGxvZ2dlcjogTG9nZ2VySW5zdGFuY2U7XG4gIHByb3RlY3RlZCBjb25uZWN0aW9uOiBDb25uZWN0aW9uO1xuICBwcm90ZWN0ZWQgY29ubmVjdGlvbk9wdGlvbnM6IENvbm5lY3Rpb25PcHRpb25zO1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgY3VzdG9tUXVlcmllczogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBFbnRpdHkgZGF0YWJhc2UgZm9yIFNRTCBkcml2ZXJzLlxuICAgKiBcbiAgICogQHBhcmFtIGNvbm5lY3Rpb24gVGhlIFR5cGVPUk0gY29ubmVjdGlvbiB0byB0aGUgZGF0YWJhc2VcbiAgICovXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBvcHRpb25zOiBFbnRpdHlEYXRhYmFzZU9wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zKTtcblxuICAgIC8vIFRPRE86IEhhbmRsZSBjb25uZWN0aW9uIHVybFxuICAgIHRoaXMuY29ubmVjdGlvbiA9IG9wdGlvbnMuY29ubmVjdGlvbjtcbiAgICB0aGlzLmNvbm5lY3Rpb25PcHRpb25zID0gb3B0aW9ucy5jb25uZWN0aW9uID8gb3B0aW9ucy5jb25uZWN0aW9uLm9wdGlvbnMgOiBvcHRpb25zLmNvbm5lY3Rpb25PcHRzO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbm5lY3RzIHRvIHRoZSBkYXRhYmFzZSwgY3JlYXRpbmcgYSBjb25uZWN0aW9uIGluc3RhbmNlIGlmIG5vdCBhdmFpbGFibGUuXG4gICAqIFxuICAgKiBAcmV0dXJucyBBIHByb21pc2UgdG8gdGhlIGNvbm5lY3Rpb24gaW5zdGFuY2UuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgY29ubmVjdCgpOiBQcm9taXNlPEVudGl0eURhdGFiYXNlT3B0aW9ucz4ge1xuICAgIGNvbnN0IHsgdHlwZSwgaG9zdCwgcG9ydCwgdXNlcm5hbWUsIGRhdGFiYXNlLCBzeW5jaHJvbml6ZSB9ID0gdGhpcy5jb25uZWN0aW9uT3B0aW9ucyBhcyBhbnk7XG5cbiAgICBpZiAodGhpcy5sb2dnZXIpIHtcbiAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdDb25uZWN0aW5nIHRvIHRoZSBkYXRhYmFzZScsIHsgdHlwZSwgaG9zdCwgcG9ydCwgdXNlcm5hbWUsIGRhdGFiYXNlLCBzeW5jaHJvbml6ZSB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb25uZWN0aW9uKSB7XG4gICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uY29ubmVjdCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jb25uZWN0aW9uT3B0aW9ucykge1xuICAgICAgdGhpcy5jb25uZWN0aW9uID0gYXdhaXQgY3JlYXRlQ29ubmVjdGlvbih0aGlzLmNvbm5lY3Rpb25PcHRpb25zKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubG9nZ2VyKSB7XG4gICAgICB0aGlzLmxvZ2dlci5zaWxseShgU3VjY2Vzc2Z1bGx5IGNvbm5lY3RlZCB0byB0aGUgZGF0YWJhc2VgLCB7IGRhdGFiYXNlIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5vcHRpb25zO1xuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXMgdGhlIGRhdGFiYXNlIG1vdW50aW5nIHJvdXRpbmVzLlxuICAgKi9cbiAgb25Nb3VudCgpOiB2b2lkIHtcbiAgICAvLyBMb2cgZW50aXRpZXMgaW5pdGlhbGl6YXRpb25cbiAgICBpZiAodGhpcy5sb2dnZXIgJiYgdGhpcy5jb25uZWN0aW9uT3B0aW9ucyAmJiB0aGlzLmNvbm5lY3Rpb25PcHRpb25zLmVudGl0aWVzKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb25PcHRpb25zLmVudGl0aWVzLm1hcCgoRW50aXR5OiBhbnkpID0+IHtcbiAgICAgICAgaWYgKEVudGl0eSAmJiBFbnRpdHkucHJvdG90eXBlICYmIEVudGl0eS5wcm90b3R5cGUuY29uc3RydWN0b3IpIHtcbiAgICAgICAgICB0aGlzLmxvZ2dlci5zaWxseShgUmVnaXN0ZXJpbmcgbW9kZWwgaW4gZGF0YWJhc2U6ICR7RW50aXR5LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5uYW1lfWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMubG9nZ2VyLndhcm4oYEludmFsaWQgbW9kZWwgcmVnaXN0ZXJlZCBpbiBkYXRhYmFzZTogJHtFbnRpdHl9YCwgRW50aXR5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gSWYgYXZhaWxhYmxlLCBjb250aW51ZSB3aXRoIGxvYWRpbmcgdGhlIGN1c3RvbSBxdWVyaWVzXG4gICAgaWYgKHRoaXMub3B0aW9ucy5jdXN0b21RdWVyaWVzRGlyKSB7XG4gICAgICB0aGlzLmxvYWRDdXN0b21RdWVyaWVzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIG1hcCBvZiB0aGUgZW50aXRpZXMgY3VycmVudGx5IHJlZ2lzdGVyZWQgaW4gdGhlIERhdGFiYXNlLlxuICAgKi9cbiAgZW50aXRpZXMoKSB7XG4gICAgaWYgKHRoaXMuY29ubmVjdGlvbk9wdGlvbnMgJiYgdGhpcy5jb25uZWN0aW9uT3B0aW9ucy5lbnRpdGllcykge1xuICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbk9wdGlvbnMuZW50aXRpZXNcbiAgICAgICAgLm1hcCgoRW50aXR5OiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAoRW50aXR5ICYmIEVudGl0eS5wcm90b3R5cGUgJiYgRW50aXR5LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgcmV0dXJuIHsgW0VudGl0eS5wcm90b3R5cGUuY29uc3RydWN0b3IubmFtZV06IEVudGl0eSB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLmZpbHRlcihhID0+ICEhYSlcbiAgICAgICAgLnJlZHVjZSgoYWdnciwgbmV4dCkgPT4gKHsgLi4uYWdnciwgLi4ubmV4dCB9KSwge30pO1xuICAgIH1cbiAgICByZXR1cm4ge307XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZGF0YWJhc2UgY3VycmVudCBzdGF0ZS5cbiAgICovXG4gIHB1YmxpYyBpc0Nvbm5lY3RlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uICYmIHRoaXMuY29ubmVjdGlvbi5pc0Nvbm5lY3RlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNjb25uZWN0cyBmcm9tIGV4aXN0aW5nIGNvbm5lY3Rpb24sIGlmIGFueS5cbiAgICovXG4gIHB1YmxpYyBhc3luYyBkaXNjb25uZWN0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHsgdHlwZSwgaG9zdCwgcG9ydCwgdXNlcm5hbWUsIGRhdGFiYXNlLCBzeW5jaHJvbml6ZSB9ID0gdGhpcy5jb25uZWN0aW9uT3B0aW9ucyBhcyBhbnk7XG4gICAgaWYgKHRoaXMuY29ubmVjdGlvbikge1xuICAgICAgaWYgKHRoaXMubG9nZ2VyKSB7XG4gICAgICAgIC8vIFRPRE86IEhpZGUgYXV0aGVudGljYXRpb24gaW5mb3JtYXRpb25cbiAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ0Rpc2Nvbm5lY3RpbmcgZnJvbSBkYXRhYmFzZScsIHsgaG9zdCwgcG9ydCwgdXNlcm5hbWUgfSk7XG4gICAgICB9XG4gICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHNpbmdsZSByZXBvc2l0b3J5IGZyb20gY29ubmVjdGlvbiBtYW5hZ2VyLlxuICAgKiBcbiAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IGNsYXNzIG9yIHRhYmxlIG5hbWVcbiAgICovXG4gIHB1YmxpYyBnZXRSZXBvc2l0b3J5PEVudGl0eT4odGFyZ2V0OiBPYmplY3RUeXBlPEVudGl0eT4gfCBFbnRpdHlTY2hlbWE8RW50aXR5PiB8IHN0cmluZyk6IFJlcG9zaXRvcnk8RW50aXR5PiB7XG4gICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5tYW5hZ2VyLmdldFJlcG9zaXRvcnkodGFyZ2V0IGFzIGFueSkgYXMgYW55O1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGVzIGEgcHJlIGxvYWRlZCBxdWVyeSBmcm9tIHRoZSBxdWVyaWVzIGRpcmVjdG9yeVxuICAgKiBUaGUgcXVlcnkgbmFtZSBpcyByZWxhdGl2ZSB0byB0aGUgY3VzdG9tUXVlcmllc0Rpciwgc28gaWYgeW91IHNhdmVkIGluXG4gICAqIGBxdWVyaWVzL3VzZXIvbGlzdC5zcWxgIHRoZW4sIHRoZSBpZGVudGlmaWVyIHdpbGwgYGJlIHVzZXIvbGlzdGBcbiAgICogQHBhcmFtIG5hbWUgVGhlIGlkZW50aWZpZXIgb2YgdGhlIHF1ZXJ5IHRvIGJlIGV4ZWN1dGVkXG4gICAqIEBwYXJhbSBwYXJhbXMgQW55IHBhcmFtcyBpZiBuZWVkZWQgdG8gYWRkIHRvIHRoZSBxdWVyeVxuICAgKi9cbiAgcHVibGljIGFzeW5jIGV4ZWN1dGVDdXN0b21RdWVyeTxUPihuYW1lOiBzdHJpbmcsIHBhcmFtczogYW55W10gPSBbXSk6IFByb21pc2U8YW55IHwgVD4ge1xuICAgIGNvbnN0IHF1ZXJ5ID0gdGhpcy5jdXN0b21RdWVyaWVzLmdldChuYW1lKTtcbiAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLnF1ZXJ5KHF1ZXJ5LCBwYXJhbXMpIGFzIFQgfCBhbnk7XG4gIH1cblxuICAvKipcbiAgICogTG9hZHMgYWxsIGN1c3RvbSBxdWVyaWVzIGZyb20gdGhlIGN1c3RvbVF1ZXJpZXNEaXIgcGF0aFxuICAgKi9cbiAgcHJpdmF0ZSBsb2FkQ3VzdG9tUXVlcmllcygpOiB2b2lkIHtcbiAgICBnbG9iKHBhdGguam9pbih0aGlzLm9wdGlvbnMuY3VzdG9tUXVlcmllc0RpciwgJy4vKiovKi5zcWwnKSwgKGVyciwgbWF0Y2hlcykgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcignQ291bGQgbm90IGxvYWQgY3VzdG9tIHF1ZXJpZXMgZGlyZWN0b3J5OiAnICsgZXJyLm1lc3NhZ2UsIGVycik7XG4gICAgICB9XG4gICAgICBtYXRjaGVzLmZvckVhY2goZmlsZVBhdGggPT4gdGhpcy5sb2FkQ3VzdG9tUXVlcnkoZmlsZVBhdGgpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkcyBhIGN1c3RvbVF1ZXJ5IHRvIHRoZSBtZW1vcnlcbiAgICogQHBhcmFtIGZpbGVQYXRoIFRoZSBmaWxlIHBhdGggdG8gYmUgbG9hZGVkIGluIG1lbW9yeVxuICAgKi9cbiAgcHJpdmF0ZSBsb2FkQ3VzdG9tUXVlcnkoZmlsZVBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IGxvY2F0aW9uID0gcGF0aC5yZWxhdGl2ZSh0aGlzLm9wdGlvbnMuY3VzdG9tUXVlcmllc0RpciwgZmlsZVBhdGgpO1xuICAgIGNvbnN0IG5hbWUgPSBsb2NhdGlvbi5zbGljZSgwLCBsb2NhdGlvbi5sYXN0SW5kZXhPZignLicpKTtcbiAgICBjb25zdCBxdWVyeSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCkudG9TdHJpbmcoKTtcbiAgICB0aGlzLmN1c3RvbVF1ZXJpZXMuc2V0KG5hbWUsIHF1ZXJ5KTtcbiAgfVxufVxuIl19