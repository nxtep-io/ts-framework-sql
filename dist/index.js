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
        this.entities = [];
        this.customQueries = new Map();
        this.logger = options.logger || new ts_framework_common_1.Logger();
        // TODO: Handle connection url
        this.connection = options.connection;
        this.connectionOptions = options.connection ? options.connection.options : options.connectionOpts;
        // Log entities initialization
        if (this.logger && this.connectionOptions && this.connectionOptions.entities) {
            this.connectionOptions.entities.map((Entity) => {
                if (Entity && Entity.prototype && Entity.prototype.constructor) {
                    this.entities.push(Entity);
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
     * Describe database status and entities.
     */
    describe() {
        return {
            isReady: this.isReady(),
            entities: this.entities,
        };
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
                    this.logger.debug('Disconnecting from database', { host, port, username, database });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDRCQUEwQjtBQUMxQiw2QkFBNkI7QUFDN0IseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QixxQ0FHaUI7QUFJakIsNkRBQXdFO0FBVXhFO0lBT0U7Ozs7T0FJRztJQUNILFlBQXNCLE9BQThCO1FBQTlCLFlBQU8sR0FBUCxPQUFPLENBQXVCO1FBVDFDLGFBQVEsR0FBaUIsRUFBRSxDQUFDO1FBRW5CLGtCQUFhLEdBQXdCLElBQUksR0FBRyxFQUFFLENBQUM7UUFRaEUsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLElBQUksNEJBQU0sRUFBRSxDQUFDO1FBRTdDLDhCQUE4QjtRQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFDckMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO1FBRWxHLDhCQUE4QjtRQUM5QixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLGlCQUFpQixJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUU7WUFDNUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFXLEVBQUUsRUFBRTtnQkFDbEQsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRTtvQkFDOUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxNQUFNLENB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QjtRQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLFlBQVksQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxFQUFFO1lBQzVFLElBQUksR0FBRyxFQUFFO2dCQUNQLGVBQWU7YUFDaEI7WUFDRCxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzlELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7T0FHRztJQUNLLGVBQWUsQ0FBQyxRQUFnQjtRQUN0QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDeEUsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzFELE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3RDLENBQUM7Q0FDRjtBQXJJRCx3Q0FxSUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIGdsb2IgZnJvbSAnZ2xvYic7XG5pbXBvcnQgeyBcbiAgY3JlYXRlQ29ubmVjdGlvbiwgQ29ubmVjdGlvbiwgQ29ubmVjdGlvbk9wdGlvbnMsIFxuICBPYmplY3RUeXBlLCBFbnRpdHlTY2hlbWEsIFJlcG9zaXRvcnksIEJhc2VFbnRpdHksXG59IGZyb20gJ3R5cGVvcm0nO1xuaW1wb3J0IHsgTXlzcWxDb25uZWN0aW9uT3B0aW9ucyB9IGZyb20gJ3R5cGVvcm0vZHJpdmVyL215c3FsL015c3FsQ29ubmVjdGlvbk9wdGlvbnMnO1xuaW1wb3J0IHsgUG9zdGdyZXNDb25uZWN0aW9uT3B0aW9ucyB9IGZyb20gJ3R5cGVvcm0vZHJpdmVyL3Bvc3RncmVzL1Bvc3RncmVzQ29ubmVjdGlvbk9wdGlvbnMnO1xuaW1wb3J0IHsgU3FsaXRlQ29ubmVjdGlvbk9wdGlvbnMgfSBmcm9tICd0eXBlb3JtL2RyaXZlci9zcWxpdGUvU3FsaXRlQ29ubmVjdGlvbk9wdGlvbnMnO1xuaW1wb3J0IHsgTG9nZ2VyLCBEYXRhYmFzZU9wdGlvbnMsIERhdGFiYXNlIH0gZnJvbSAndHMtZnJhbWV3b3JrLWNvbW1vbic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW50aXR5RGF0YWJhc2VPcHRpb25zIGV4dGVuZHMgRGF0YWJhc2VPcHRpb25zIHtcbiAgbG9nZ2VyPzogTG9nZ2VyO1xuICBjb25uZWN0aW9uPzogQ29ubmVjdGlvbjtcbiAgY29ubmVjdGlvbk9wdHM/OiBDb25uZWN0aW9uT3B0aW9ucztcbiAgY3VzdG9tUXVlcmllc0Rpcj86IHN0cmluZztcbiAgZW50aXRpZXM6IGFueVtdO1xufVxuXG5leHBvcnQgY2xhc3MgRW50aXR5RGF0YWJhc2UgaW1wbGVtZW50cyBEYXRhYmFzZSB7XG4gIHByb3RlY3RlZCBsb2dnZXI6IExvZ2dlcjtcbiAgcHJvdGVjdGVkIGNvbm5lY3Rpb246IENvbm5lY3Rpb247XG4gIHByb3RlY3RlZCBlbnRpdGllczogQmFzZUVudGl0eVtdID0gW107XG4gIHByb3RlY3RlZCBjb25uZWN0aW9uT3B0aW9uczogQ29ubmVjdGlvbk9wdGlvbnM7XG4gIHByb3RlY3RlZCByZWFkb25seSBjdXN0b21RdWVyaWVzOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IEVudGl0eSBkYXRhYmFzZSBmb3IgU1FMIGRyaXZlcnMuXG4gICAqIFxuICAgKiBAcGFyYW0gY29ubmVjdGlvbiBUaGUgVHlwZU9STSBjb25uZWN0aW9uIHRvIHRoZSBkYXRhYmFzZVxuICAgKi9cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIG9wdGlvbnM6IEVudGl0eURhdGFiYXNlT3B0aW9ucykge1xuICAgIHRoaXMubG9nZ2VyID0gb3B0aW9ucy5sb2dnZXIgfHwgbmV3IExvZ2dlcigpO1xuXG4gICAgLy8gVE9ETzogSGFuZGxlIGNvbm5lY3Rpb24gdXJsXG4gICAgdGhpcy5jb25uZWN0aW9uID0gb3B0aW9ucy5jb25uZWN0aW9uO1xuICAgIHRoaXMuY29ubmVjdGlvbk9wdGlvbnMgPSBvcHRpb25zLmNvbm5lY3Rpb24gPyBvcHRpb25zLmNvbm5lY3Rpb24ub3B0aW9ucyA6IG9wdGlvbnMuY29ubmVjdGlvbk9wdHM7XG5cbiAgICAvLyBMb2cgZW50aXRpZXMgaW5pdGlhbGl6YXRpb25cbiAgICBpZiAodGhpcy5sb2dnZXIgJiYgdGhpcy5jb25uZWN0aW9uT3B0aW9ucyAmJiB0aGlzLmNvbm5lY3Rpb25PcHRpb25zLmVudGl0aWVzKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb25PcHRpb25zLmVudGl0aWVzLm1hcCgoRW50aXR5OiBhbnkpID0+IHtcbiAgICAgICAgaWYgKEVudGl0eSAmJiBFbnRpdHkucHJvdG90eXBlICYmIEVudGl0eS5wcm90b3R5cGUuY29uc3RydWN0b3IpIHtcbiAgICAgICAgICB0aGlzLmVudGl0aWVzLnB1c2goRW50aXR5KTtcbiAgICAgICAgICB0aGlzLmxvZ2dlci5zaWxseShgUmVnaXN0ZXJpbmcgbW9kZWwgaW4gZGF0YWJhc2U6ICR7RW50aXR5LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5uYW1lfWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMubG9nZ2VyLndhcm4oYEludmFsaWQgbW9kZWwgcmVnaXN0ZXJlZCBpbiBkYXRhYmFzZTogJHtFbnRpdHl9YCwgRW50aXR5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmN1c3RvbVF1ZXJpZXNEaXIpIHtcbiAgICAgIHRoaXMubG9hZEN1c3RvbVF1ZXJpZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29ubmVjdHMgdG8gdGhlIGRhdGFiYXNlLCBjcmVhdGluZyBhIGNvbm5lY3Rpb24gaW5zdGFuY2UgaWYgbm90IGF2YWlsYWJsZS5cbiAgICogXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSB0byB0aGUgY29ubmVjdGlvbiBpbnN0YW5jZS5cbiAgICovXG4gIHB1YmxpYyBhc3luYyBjb25uZWN0KCk6IFByb21pc2U8RW50aXR5RGF0YWJhc2VPcHRpb25zPiB7XG4gICAgY29uc3QgeyB0eXBlLCBob3N0LCBwb3J0LCB1c2VybmFtZSwgZGF0YWJhc2UsIHN5bmNocm9uaXplIH0gPSB0aGlzLmNvbm5lY3Rpb25PcHRpb25zIGFzIGFueTtcblxuICAgIGlmICh0aGlzLmxvZ2dlcikge1xuICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ0Nvbm5lY3RpbmcgdG8gdGhlIGRhdGFiYXNlJywgeyB0eXBlLCBob3N0LCBwb3J0LCB1c2VybmFtZSwgZGF0YWJhc2UsIHN5bmNocm9uaXplIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbm5lY3Rpb24pIHtcbiAgICAgIGF3YWl0IHRoaXMuY29ubmVjdGlvbi5jb25uZWN0KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvbm5lY3Rpb25PcHRpb25zKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb24gPSBhd2FpdCBjcmVhdGVDb25uZWN0aW9uKHRoaXMuY29ubmVjdGlvbk9wdGlvbnMpO1xuICAgIH1cbiAgICBpZiAodGhpcy5sb2dnZXIpIHtcbiAgICAgIHRoaXMubG9nZ2VyLnNpbGx5KGBTdWNjZXNzZnVsbHkgY29ubmVjdGVkIHRvIHRoZSBkYXRhYmFzZWAsIHsgZGF0YWJhc2UgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm9wdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZGF0YWJhc2UgY3VycmVudCBzdGF0ZS5cbiAgICovXG4gIHB1YmxpYyBpc1JlYWR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24gJiYgdGhpcy5jb25uZWN0aW9uLmlzQ29ubmVjdGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIERlc2NyaWJlIGRhdGFiYXNlIHN0YXR1cyBhbmQgZW50aXRpZXMuXG4gICAqL1xuICBwdWJsaWMgZGVzY3JpYmUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlzUmVhZHk6IHRoaXMuaXNSZWFkeSgpLFxuICAgICAgZW50aXRpZXM6IHRoaXMuZW50aXRpZXMsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNjb25uZWN0cyBmcm9tIGV4aXN0aW5nIGNvbm5lY3Rpb24sIGlmIGFueS5cbiAgICovXG4gIHB1YmxpYyBhc3luYyBkaXNjb25uZWN0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHsgdHlwZSwgaG9zdCwgcG9ydCwgdXNlcm5hbWUsIGRhdGFiYXNlLCBzeW5jaHJvbml6ZSB9ID0gdGhpcy5jb25uZWN0aW9uT3B0aW9ucyBhcyBhbnk7XG5cbiAgICBpZiAodGhpcy5jb25uZWN0aW9uKSB7XG4gICAgICBpZiAodGhpcy5sb2dnZXIpIHtcbiAgICAgICAgLy8gVE9ETzogSGlkZSBhdXRoZW50aWNhdGlvbiBpbmZvcm1hdGlvblxuICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnRGlzY29ubmVjdGluZyBmcm9tIGRhdGFiYXNlJywgeyBob3N0LCBwb3J0LCB1c2VybmFtZSwgZGF0YWJhc2UgfSk7XG4gICAgICB9XG4gICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHNpbmdsZSByZXBvc2l0b3J5IGZyb20gY29ubmVjdGlvbiBtYW5hZ2VyLlxuICAgKiBcbiAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IGNsYXNzIG9yIHRhYmxlIG5hbWVcbiAgICovXG4gIHB1YmxpYyBnZXRSZXBvc2l0b3J5PEVudGl0eT4odGFyZ2V0OiBPYmplY3RUeXBlPEVudGl0eT4gfCBFbnRpdHlTY2hlbWE8RW50aXR5PiB8IHN0cmluZyk6IFJlcG9zaXRvcnk8RW50aXR5PiB7XG4gICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5tYW5hZ2VyLmdldFJlcG9zaXRvcnkodGFyZ2V0IGFzIGFueSkgYXMgYW55O1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGVzIGEgcHJlIGxvYWRlZCBxdWVyeSBmcm9tIHRoZSBxdWVyaWVzIGRpcmVjdG9yeVxuICAgKiBUaGUgcXVlcnkgbmFtZSBpcyByZWxhdGl2ZSB0byB0aGUgY3VzdG9tUXVlcmllc0Rpciwgc28gaWYgeW91IHNhdmVkIGluXG4gICAqIGBxdWVyaWVzL3VzZXIvbGlzdC5zcWxgIHRoZW4sIHRoZSBpZGVudGlmaWVyIHdpbGwgYGJlIHVzZXIvbGlzdGBcbiAgICogQHBhcmFtIG5hbWUgVGhlIGlkZW50aWZpZXIgb2YgdGhlIHF1ZXJ5IHRvIGJlIGV4ZWN1dGVkXG4gICAqIEBwYXJhbSBwYXJhbXMgQW55IHBhcmFtcyBpZiBuZWVkZWQgdG8gYWRkIHRvIHRoZSBxdWVyeVxuICAgKi9cbiAgcHVibGljIGFzeW5jIGV4ZWN1dGVDdXN0b21RdWVyeTxUPihuYW1lOiBzdHJpbmcsIHBhcmFtczogYW55W10gPSBbXSk6IFByb21pc2U8YW55IHwgVD4ge1xuICAgIGNvbnN0IHF1ZXJ5ID0gdGhpcy5jdXN0b21RdWVyaWVzLmdldChuYW1lKTtcbiAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLnF1ZXJ5KHF1ZXJ5LCBwYXJhbXMpIGFzIFQgfCBhbnk7XG4gIH1cblxuICAvKipcbiAgICogTG9hZHMgYWxsIGN1c3RvbSBxdWVyaWVzIGZyb20gdGhlIGN1c3RvbVF1ZXJpZXNEaXIgcGF0aFxuICAgKi9cbiAgcHJpdmF0ZSBsb2FkQ3VzdG9tUXVlcmllcygpOiB2b2lkIHtcbiAgICBnbG9iKHBhdGguam9pbih0aGlzLm9wdGlvbnMuY3VzdG9tUXVlcmllc0RpciwgJy4vKiovKi5zcWwnKSwgKGVyciwgbWF0Y2hlcykgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICAvLyBEbyBzb21ldGhpbmdcbiAgICAgIH1cbiAgICAgIG1hdGNoZXMuZm9yRWFjaChmaWxlUGF0aCA9PiB0aGlzLmxvYWRDdXN0b21RdWVyeShmaWxlUGF0aCkpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIGEgY3VzdG9tUXVlcnkgdG8gdGhlIG1lbW9yeVxuICAgKiBAcGFyYW0gZmlsZVBhdGggVGhlIGZpbGUgcGF0aCB0byBiZSBsb2FkZWQgaW4gbWVtb3J5XG4gICAqL1xuICBwcml2YXRlIGxvYWRDdXN0b21RdWVyeShmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgbG9jYXRpb24gPSBwYXRoLnJlbGF0aXZlKHRoaXMub3B0aW9ucy5jdXN0b21RdWVyaWVzRGlyLCBmaWxlUGF0aCk7XG4gICAgY29uc3QgbmFtZSA9IGxvY2F0aW9uLnNsaWNlKDAsIGxvY2F0aW9uLmxhc3RJbmRleE9mKCcuJykpO1xuICAgIGNvbnN0IHF1ZXJ5ID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoKS50b1N0cmluZygpO1xuICAgIHRoaXMuY3VzdG9tUXVlcmllcy5zZXQobmFtZSwgcXVlcnkpO1xuICB9XG59XG4iXX0=