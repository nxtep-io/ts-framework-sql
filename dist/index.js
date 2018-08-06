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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDRCQUEwQjtBQUMxQiw2QkFBNkI7QUFDN0IseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QixxQ0FHaUI7QUFJakIsNkRBQW9GO0FBVXBGLE1BQWEsY0FBZSxTQUFRLDhCQUFRO0lBTTFDOzs7O09BSUc7SUFDSCxZQUFtQixPQUE4QjtRQUMvQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFERSxZQUFPLEdBQVAsT0FBTyxDQUF1QjtRQVA5QixrQkFBYSxHQUF3QixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBVWhFLDhCQUE4QjtRQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFDckMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO0lBQ3BHLENBQUM7SUFFRDs7OztPQUlHO0lBQ1UsT0FBTzs7WUFDbEIsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLGlCQUF3QixDQUFDO1lBRTVGLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDZixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQzthQUN4RztZQUVELElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDbkIsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQ2pDO2lC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QyxDQUFDLENBQUM7UUFDMUQsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdEMsQ0FBQztDQUNGO0FBaEpELHdDQWdKQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAncmVmbGVjdC1tZXRhZGF0YSc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCB7XG4gIGNyZWF0ZUNvbm5lY3Rpb24sIENvbm5lY3Rpb24sIENvbm5lY3Rpb25PcHRpb25zLFxuICBPYmplY3RUeXBlLCBFbnRpdHlTY2hlbWEsIFJlcG9zaXRvcnksIEJhc2VFbnRpdHksIGdldE1ldGFkYXRhQXJnc1N0b3JhZ2UsXG59IGZyb20gJ3R5cGVvcm0nO1xuaW1wb3J0IHsgTXlzcWxDb25uZWN0aW9uT3B0aW9ucyB9IGZyb20gJ3R5cGVvcm0vZHJpdmVyL215c3FsL015c3FsQ29ubmVjdGlvbk9wdGlvbnMnO1xuaW1wb3J0IHsgUG9zdGdyZXNDb25uZWN0aW9uT3B0aW9ucyB9IGZyb20gJ3R5cGVvcm0vZHJpdmVyL3Bvc3RncmVzL1Bvc3RncmVzQ29ubmVjdGlvbk9wdGlvbnMnO1xuaW1wb3J0IHsgU3FsaXRlQ29ubmVjdGlvbk9wdGlvbnMgfSBmcm9tICd0eXBlb3JtL2RyaXZlci9zcWxpdGUvU3FsaXRlQ29ubmVjdGlvbk9wdGlvbnMnO1xuaW1wb3J0IHsgTG9nZ2VyLCBEYXRhYmFzZU9wdGlvbnMsIERhdGFiYXNlLCBCYXNlU2VydmVyIH0gZnJvbSAndHMtZnJhbWV3b3JrLWNvbW1vbic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5RGF0YWJhc2VPcHRpb25zIGV4dGVuZHMgRGF0YWJhc2VPcHRpb25zIHtcbiAgbG9nZ2VyPzogTG9nZ2VyO1xuICBjb25uZWN0aW9uPzogQ29ubmVjdGlvbjtcbiAgY29ubmVjdGlvbk9wdHM/OiBDb25uZWN0aW9uT3B0aW9ucztcbiAgY3VzdG9tUXVlcmllc0Rpcj86IHN0cmluZztcbiAgZW50aXRpZXM6IGFueVtdO1xufVxuXG5leHBvcnQgY2xhc3MgRW50aXR5RGF0YWJhc2UgZXh0ZW5kcyBEYXRhYmFzZSB7XG4gIHB1YmxpYyBsb2dnZXI6IExvZ2dlcjtcbiAgcHJvdGVjdGVkIGNvbm5lY3Rpb246IENvbm5lY3Rpb247XG4gIHByb3RlY3RlZCBjb25uZWN0aW9uT3B0aW9uczogQ29ubmVjdGlvbk9wdGlvbnM7XG4gIHByb3RlY3RlZCByZWFkb25seSBjdXN0b21RdWVyaWVzOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IEVudGl0eSBkYXRhYmFzZSBmb3IgU1FMIGRyaXZlcnMuXG4gICAqIFxuICAgKiBAcGFyYW0gY29ubmVjdGlvbiBUaGUgVHlwZU9STSBjb25uZWN0aW9uIHRvIHRoZSBkYXRhYmFzZVxuICAgKi9cbiAgY29uc3RydWN0b3IocHVibGljIG9wdGlvbnM6IEVudGl0eURhdGFiYXNlT3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuXG4gICAgLy8gVE9ETzogSGFuZGxlIGNvbm5lY3Rpb24gdXJsXG4gICAgdGhpcy5jb25uZWN0aW9uID0gb3B0aW9ucy5jb25uZWN0aW9uO1xuICAgIHRoaXMuY29ubmVjdGlvbk9wdGlvbnMgPSBvcHRpb25zLmNvbm5lY3Rpb24gPyBvcHRpb25zLmNvbm5lY3Rpb24ub3B0aW9ucyA6IG9wdGlvbnMuY29ubmVjdGlvbk9wdHM7XG4gIH1cblxuICAvKipcbiAgICogQ29ubmVjdHMgdG8gdGhlIGRhdGFiYXNlLCBjcmVhdGluZyBhIGNvbm5lY3Rpb24gaW5zdGFuY2UgaWYgbm90IGF2YWlsYWJsZS5cbiAgICogXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSB0byB0aGUgY29ubmVjdGlvbiBpbnN0YW5jZS5cbiAgICovXG4gIHB1YmxpYyBhc3luYyBjb25uZWN0KCk6IFByb21pc2U8RW50aXR5RGF0YWJhc2VPcHRpb25zPiB7XG4gICAgY29uc3QgeyB0eXBlLCBob3N0LCBwb3J0LCB1c2VybmFtZSwgZGF0YWJhc2UsIHN5bmNocm9uaXplIH0gPSB0aGlzLmNvbm5lY3Rpb25PcHRpb25zIGFzIGFueTtcblxuICAgIGlmICh0aGlzLmxvZ2dlcikge1xuICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ0Nvbm5lY3RpbmcgdG8gdGhlIGRhdGFiYXNlJywgeyB0eXBlLCBob3N0LCBwb3J0LCB1c2VybmFtZSwgZGF0YWJhc2UsIHN5bmNocm9uaXplIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbm5lY3Rpb24pIHtcbiAgICAgIGF3YWl0IHRoaXMuY29ubmVjdGlvbi5jb25uZWN0KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvbm5lY3Rpb25PcHRpb25zKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb24gPSBhd2FpdCBjcmVhdGVDb25uZWN0aW9uKHRoaXMuY29ubmVjdGlvbk9wdGlvbnMpO1xuICAgIH1cbiAgICBpZiAodGhpcy5sb2dnZXIpIHtcbiAgICAgIHRoaXMubG9nZ2VyLnNpbGx5KGBTdWNjZXNzZnVsbHkgY29ubmVjdGVkIHRvIHRoZSBkYXRhYmFzZWAsIHsgZGF0YWJhc2UgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm9wdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyB0aGUgZGF0YWJhc2UgbW91bnRpbmcgcm91dGluZXMuXG4gICAqL1xuICBvbk1vdW50KCk6IHZvaWQge1xuICAgIC8vIExvZyBlbnRpdGllcyBpbml0aWFsaXphdGlvblxuICAgIGlmICh0aGlzLmxvZ2dlciAmJiB0aGlzLmNvbm5lY3Rpb25PcHRpb25zICYmIHRoaXMuY29ubmVjdGlvbk9wdGlvbnMuZW50aXRpZXMpIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbk9wdGlvbnMuZW50aXRpZXMubWFwKChFbnRpdHk6IGFueSkgPT4ge1xuICAgICAgICBpZiAoRW50aXR5ICYmIEVudGl0eS5wcm90b3R5cGUgJiYgRW50aXR5LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcikge1xuICAgICAgICAgIHRoaXMubG9nZ2VyLnNpbGx5KGBSZWdpc3RlcmluZyBtb2RlbCBpbiBkYXRhYmFzZTogJHtFbnRpdHkucHJvdG90eXBlLmNvbnN0cnVjdG9yLm5hbWV9YCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5sb2dnZXIud2FybihgSW52YWxpZCBtb2RlbCByZWdpc3RlcmVkIGluIGRhdGFiYXNlOiAke0VudGl0eX1gLCBFbnRpdHkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBJZiBhdmFpbGFibGUsIGNvbnRpbnVlIHdpdGggbG9hZGluZyB0aGUgY3VzdG9tIHF1ZXJpZXNcbiAgICBpZiAodGhpcy5vcHRpb25zLmN1c3RvbVF1ZXJpZXNEaXIpIHtcbiAgICAgIHRoaXMubG9hZEN1c3RvbVF1ZXJpZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgbWFwIG9mIHRoZSBlbnRpdGllcyBjdXJyZW50bHkgcmVnaXN0ZXJlZCBpbiB0aGUgRGF0YWJhc2UuXG4gICAqL1xuICBlbnRpdGllcygpIHtcbiAgICBpZiAodGhpcy5jb25uZWN0aW9uT3B0aW9ucyAmJiB0aGlzLmNvbm5lY3Rpb25PcHRpb25zLmVudGl0aWVzKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uT3B0aW9ucy5lbnRpdGllc1xuICAgICAgICAubWFwKChFbnRpdHk6IGFueSkgPT4ge1xuICAgICAgICAgIGlmIChFbnRpdHkgJiYgRW50aXR5LnByb3RvdHlwZSAmJiBFbnRpdHkucHJvdG90eXBlLmNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4geyBbRW50aXR5LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5uYW1lXTogRW50aXR5IH07XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuZmlsdGVyKGEgPT4gISFhKVxuICAgICAgICAucmVkdWNlKChhZ2dyLCBuZXh0KSA9PiAoeyAuLi5hZ2dyLCAuLi5uZXh0IH0pLCB7fSk7XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBkYXRhYmFzZSBjdXJyZW50IHN0YXRlLlxuICAgKi9cbiAgcHVibGljIGlzQ29ubmVjdGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24gJiYgdGhpcy5jb25uZWN0aW9uLmlzQ29ubmVjdGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc2Nvbm5lY3RzIGZyb20gZXhpc3RpbmcgY29ubmVjdGlvbiwgaWYgYW55LlxuICAgKi9cbiAgcHVibGljIGFzeW5jIGRpc2Nvbm5lY3QoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgeyB0eXBlLCBob3N0LCBwb3J0LCB1c2VybmFtZSwgZGF0YWJhc2UsIHN5bmNocm9uaXplIH0gPSB0aGlzLmNvbm5lY3Rpb25PcHRpb25zIGFzIGFueTtcbiAgICBpZiAodGhpcy5jb25uZWN0aW9uKSB7XG4gICAgICBpZiAodGhpcy5sb2dnZXIpIHtcbiAgICAgICAgLy8gVE9ETzogSGlkZSBhdXRoZW50aWNhdGlvbiBpbmZvcm1hdGlvblxuICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnRGlzY29ubmVjdGluZyBmcm9tIGRhdGFiYXNlJywgeyBob3N0LCBwb3J0LCB1c2VybmFtZSB9KTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IHRoaXMuY29ubmVjdGlvbi5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgc2luZ2xlIHJlcG9zaXRvcnkgZnJvbSBjb25uZWN0aW9uIG1hbmFnZXIuXG4gICAqIFxuICAgKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgY2xhc3Mgb3IgdGFibGUgbmFtZVxuICAgKi9cbiAgcHVibGljIGdldFJlcG9zaXRvcnk8RW50aXR5Pih0YXJnZXQ6IE9iamVjdFR5cGU8RW50aXR5PiB8IEVudGl0eVNjaGVtYTxFbnRpdHk+IHwgc3RyaW5nKTogUmVwb3NpdG9yeTxFbnRpdHk+IHtcbiAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLm1hbmFnZXIuZ2V0UmVwb3NpdG9yeSh0YXJnZXQgYXMgYW55KSBhcyBhbnk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZXMgYSBwcmUgbG9hZGVkIHF1ZXJ5IGZyb20gdGhlIHF1ZXJpZXMgZGlyZWN0b3J5XG4gICAqIFRoZSBxdWVyeSBuYW1lIGlzIHJlbGF0aXZlIHRvIHRoZSBjdXN0b21RdWVyaWVzRGlyLCBzbyBpZiB5b3Ugc2F2ZWQgaW5cbiAgICogYHF1ZXJpZXMvdXNlci9saXN0LnNxbGAgdGhlbiwgdGhlIGlkZW50aWZpZXIgd2lsbCBgYmUgdXNlci9saXN0YFxuICAgKiBAcGFyYW0gbmFtZSBUaGUgaWRlbnRpZmllciBvZiB0aGUgcXVlcnkgdG8gYmUgZXhlY3V0ZWRcbiAgICogQHBhcmFtIHBhcmFtcyBBbnkgcGFyYW1zIGlmIG5lZWRlZCB0byBhZGQgdG8gdGhlIHF1ZXJ5XG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZXhlY3V0ZUN1c3RvbVF1ZXJ5PFQ+KG5hbWU6IHN0cmluZywgcGFyYW1zOiBhbnlbXSA9IFtdKTogUHJvbWlzZTxhbnkgfCBUPiB7XG4gICAgY29uc3QgcXVlcnkgPSB0aGlzLmN1c3RvbVF1ZXJpZXMuZ2V0KG5hbWUpO1xuICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24ucXVlcnkocXVlcnksIHBhcmFtcykgYXMgVCB8IGFueTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkcyBhbGwgY3VzdG9tIHF1ZXJpZXMgZnJvbSB0aGUgY3VzdG9tUXVlcmllc0RpciBwYXRoXG4gICAqL1xuICBwcml2YXRlIGxvYWRDdXN0b21RdWVyaWVzKCk6IHZvaWQge1xuICAgIGdsb2IocGF0aC5qb2luKHRoaXMub3B0aW9ucy5jdXN0b21RdWVyaWVzRGlyLCAnLi8qKi8qLnNxbCcpLCAoZXJyLCBtYXRjaGVzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKCdDb3VsZCBub3QgbG9hZCBjdXN0b20gcXVlcmllcyBkaXJlY3Rvcnk6ICcgKyBlcnIubWVzc2FnZSwgZXJyKTtcbiAgICAgIH1cbiAgICAgIG1hdGNoZXMuZm9yRWFjaChmaWxlUGF0aCA9PiB0aGlzLmxvYWRDdXN0b21RdWVyeShmaWxlUGF0aCkpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIGEgY3VzdG9tUXVlcnkgdG8gdGhlIG1lbW9yeVxuICAgKiBAcGFyYW0gZmlsZVBhdGggVGhlIGZpbGUgcGF0aCB0byBiZSBsb2FkZWQgaW4gbWVtb3J5XG4gICAqL1xuICBwcml2YXRlIGxvYWRDdXN0b21RdWVyeShmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgbG9jYXRpb24gPSBwYXRoLnJlbGF0aXZlKHRoaXMub3B0aW9ucy5jdXN0b21RdWVyaWVzRGlyLCBmaWxlUGF0aCk7XG4gICAgY29uc3QgbmFtZSA9IGxvY2F0aW9uLnNsaWNlKDAsIGxvY2F0aW9uLmxhc3RJbmRleE9mKCcuJykpO1xuICAgIGNvbnN0IHF1ZXJ5ID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoKS50b1N0cmluZygpO1xuICAgIHRoaXMuY3VzdG9tUXVlcmllcy5zZXQobmFtZSwgcXVlcnkpO1xuICB9XG59XG4iXX0=