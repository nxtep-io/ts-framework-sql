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
const typeorm_1 = require("typeorm");
const common_1 = require("../common");
const path = require("path");
const fs = require("fs");
const glob = require("glob");
class EntityDatabase {
    /**
     * Creates a new Entity database for SQL drivers.
     *
     * @param connection The TypeORM connection to the database
     */
    constructor(options) {
        this.options = options;
        this.customQueries = new Map();
        this.logger = options.logger || new common_1.Logger();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDRCQUEwQjtBQUMxQixxQ0FBZ0g7QUFJaEgsc0NBQThEO0FBQzlELDZCQUE2QjtBQUM3Qix5QkFBeUI7QUFDekIsNkJBQTZCO0FBVTdCO0lBTUU7Ozs7T0FJRztJQUNILFlBQXNCLE9BQThCO1FBQTlCLFlBQU8sR0FBUCxPQUFPLENBQXVCO1FBUGpDLGtCQUFhLEdBQXdCLElBQUksR0FBRyxFQUFFLENBQUM7UUFRaEUsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLElBQUksZUFBTSxFQUFFLENBQUM7UUFFN0MsOEJBQThCO1FBQzlCLElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQztRQUNyQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUM7UUFFbEcsOEJBQThCO1FBQzlCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsaUJBQWlCLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRTtZQUM1RSxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQVcsRUFBRSxFQUFFO2dCQUNsRCxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFO29CQUM5RCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxrQ0FBa0MsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztpQkFDMUY7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLE1BQU0s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SSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMxRCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ25ELElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN0QyxDQUFDO0NBQ0Y7QUF2SEQsd0NBdUhDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IGNyZWF0ZUNvbm5lY3Rpb24sIENvbm5lY3Rpb24sIENvbm5lY3Rpb25PcHRpb25zLCBPYmplY3RUeXBlLCBFbnRpdHlTY2hlbWEsIFJlcG9zaXRvcnkgfSBmcm9tICd0eXBlb3JtJztcbmltcG9ydCB7IE15c3FsQ29ubmVjdGlvbk9wdGlvbnMgfSBmcm9tICd0eXBlb3JtL2RyaXZlci9teXNxbC9NeXNxbENvbm5lY3Rpb25PcHRpb25zJztcbmltcG9ydCB7IFBvc3RncmVzQ29ubmVjdGlvbk9wdGlvbnMgfSBmcm9tICd0eXBlb3JtL2RyaXZlci9wb3N0Z3Jlcy9Qb3N0Z3Jlc0Nvbm5lY3Rpb25PcHRpb25zJztcbmltcG9ydCB7IFNxbGl0ZUNvbm5lY3Rpb25PcHRpb25zIH0gZnJvbSAndHlwZW9ybS9kcml2ZXIvc3FsaXRlL1NxbGl0ZUNvbm5lY3Rpb25PcHRpb25zJztcbmltcG9ydCB7IExvZ2dlciwgRGF0YWJhc2VPcHRpb25zLCBEYXRhYmFzZSB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgZ2xvYiBmcm9tICdnbG9iJztcblxuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlEYXRhYmFzZU9wdGlvbnMgZXh0ZW5kcyBEYXRhYmFzZU9wdGlvbnMge1xuICBsb2dnZXI/OiBMb2dnZXI7XG4gIGNvbm5lY3Rpb24/OiBDb25uZWN0aW9uO1xuICBjb25uZWN0aW9uT3B0cz86IENvbm5lY3Rpb25PcHRpb25zO1xuICBjdXN0b21RdWVyaWVzRGlyPzogc3RyaW5nO1xuICBlbnRpdGllczogYW55W107XG59XG5cbmV4cG9ydCBjbGFzcyBFbnRpdHlEYXRhYmFzZSBpbXBsZW1lbnRzIERhdGFiYXNlIHtcbiAgcHJvdGVjdGVkIGxvZ2dlcjogTG9nZ2VyO1xuICBwcm90ZWN0ZWQgY29ubmVjdGlvbjogQ29ubmVjdGlvbjtcbiAgcHJvdGVjdGVkIGNvbm5lY3Rpb25PcHRpb25zOiBDb25uZWN0aW9uT3B0aW9ucztcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGN1c3RvbVF1ZXJpZXM6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgRW50aXR5IGRhdGFiYXNlIGZvciBTUUwgZHJpdmVycy5cbiAgICogXG4gICAqIEBwYXJhbSBjb25uZWN0aW9uIFRoZSBUeXBlT1JNIGNvbm5lY3Rpb24gdG8gdGhlIGRhdGFiYXNlXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgb3B0aW9uczogRW50aXR5RGF0YWJhc2VPcHRpb25zKSB7XG4gICAgdGhpcy5sb2dnZXIgPSBvcHRpb25zLmxvZ2dlciB8fCBuZXcgTG9nZ2VyKCk7XG5cbiAgICAvLyBUT0RPOiBIYW5kbGUgY29ubmVjdGlvbiB1cmxcbiAgICB0aGlzLmNvbm5lY3Rpb24gPSBvcHRpb25zLmNvbm5lY3Rpb247XG4gICAgdGhpcy5jb25uZWN0aW9uT3B0aW9ucyA9IG9wdGlvbnMuY29ubmVjdGlvbiA/IG9wdGlvbnMuY29ubmVjdGlvbi5vcHRpb25zIDogb3B0aW9ucy5jb25uZWN0aW9uT3B0cztcblxuICAgIC8vIExvZyBlbnRpdGllcyBpbml0aWFsaXphdGlvblxuICAgIGlmICh0aGlzLmxvZ2dlciAmJiB0aGlzLmNvbm5lY3Rpb25PcHRpb25zICYmIHRoaXMuY29ubmVjdGlvbk9wdGlvbnMuZW50aXRpZXMpIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbk9wdGlvbnMuZW50aXRpZXMubWFwKChFbnRpdHk6IGFueSkgPT4ge1xuICAgICAgICBpZiAoRW50aXR5ICYmIEVudGl0eS5wcm90b3R5cGUgJiYgRW50aXR5LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcikge1xuICAgICAgICAgIHRoaXMubG9nZ2VyLnNpbGx5KGBSZWdpc3RlcmluZyBtb2RlbCBpbiBkYXRhYmFzZTogJHtFbnRpdHkucHJvdG90eXBlLmNvbnN0cnVjdG9yLm5hbWV9YCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5sb2dnZXIud2FybihgSW52YWxpZCBtb2RlbCByZWdpc3RlcmVkIGluIGRhdGFiYXNlOiAke0VudGl0eX1gLCBFbnRpdHkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuY3VzdG9tUXVlcmllc0Rpcikge1xuICAgICAgdGhpcy5sb2FkQ3VzdG9tUXVlcmllcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb25uZWN0cyB0byB0aGUgZGF0YWJhc2UsIGNyZWF0aW5nIGEgY29ubmVjdGlvbiBpbnN0YW5jZSBpZiBub3QgYXZhaWxhYmxlLlxuICAgKiBcbiAgICogQHJldHVybnMgQSBwcm9taXNlIHRvIHRoZSBjb25uZWN0aW9uIGluc3RhbmNlLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIGNvbm5lY3QoKTogUHJvbWlzZTxFbnRpdHlEYXRhYmFzZU9wdGlvbnM+IHtcbiAgICBjb25zdCB7IHR5cGUsIGhvc3QsIHBvcnQsIHVzZXJuYW1lLCBkYXRhYmFzZSwgc3luY2hyb25pemUgfSA9IHRoaXMuY29ubmVjdGlvbk9wdGlvbnMgYXMgYW55O1xuXG4gICAgaWYgKHRoaXMubG9nZ2VyKSB7XG4gICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnQ29ubmVjdGluZyB0byB0aGUgZGF0YWJhc2UnLCB7IHR5cGUsIGhvc3QsIHBvcnQsIHVzZXJuYW1lLCBkYXRhYmFzZSwgc3luY2hyb25pemUgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29ubmVjdGlvbikge1xuICAgICAgYXdhaXQgdGhpcy5jb25uZWN0aW9uLmNvbm5lY3QoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29ubmVjdGlvbk9wdGlvbnMpIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbiA9IGF3YWl0IGNyZWF0ZUNvbm5lY3Rpb24odGhpcy5jb25uZWN0aW9uT3B0aW9ucyk7XG4gICAgfVxuICAgIGlmICh0aGlzLmxvZ2dlcikge1xuICAgICAgdGhpcy5sb2dnZXIuc2lsbHkoYFN1Y2Nlc3NmdWxseSBjb25uZWN0ZWQgdG8gdGhlIGRhdGFiYXNlYCwgeyBkYXRhYmFzZSB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBkYXRhYmFzZSBjdXJyZW50IHN0YXRlLlxuICAgKi9cbiAgcHVibGljIGlzUmVhZHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbiAmJiB0aGlzLmNvbm5lY3Rpb24uaXNDb25uZWN0ZWQ7XG4gIH1cblxuICAvKipcbiAgICogRGlzY29ubmVjdHMgZnJvbSBleGlzdGluZyBjb25uZWN0aW9uLCBpZiBhbnkuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZGlzY29ubmVjdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAodGhpcy5jb25uZWN0aW9uKSB7XG4gICAgICBpZiAodGhpcy5sb2dnZXIpIHtcbiAgICAgICAgLy8gVE9ETzogSGlkZSBhdXRoZW50aWNhdGlvbiBpbmZvcm1hdGlvblxuICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnRGlzY29ubmVjdGluZyBmcm9tIGRhdGFiYXNlJywgdGhpcy5jb25uZWN0aW9uT3B0aW9ucyk7XG4gICAgICB9XG4gICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHNpbmdsZSByZXBvc2l0b3J5IGZyb20gY29ubmVjdGlvbiBtYW5hZ2VyLlxuICAgKiBcbiAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IGNsYXNzIG9yIHRhYmxlIG5hbWVcbiAgICovXG4gIHB1YmxpYyBnZXRSZXBvc2l0b3J5PEVudGl0eT4odGFyZ2V0OiBPYmplY3RUeXBlPEVudGl0eT4gfCBFbnRpdHlTY2hlbWE8RW50aXR5PiB8IHN0cmluZyk6IFJlcG9zaXRvcnk8RW50aXR5PiB7XG4gICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5tYW5hZ2VyLmdldFJlcG9zaXRvcnkodGFyZ2V0IGFzIGFueSkgYXMgYW55O1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGVzIGEgcHJlIGxvYWRlZCBxdWVyeSBmcm9tIHRoZSBxdWVyaWVzIGRpcmVjdG9yeVxuICAgKiBUaGUgcXVlcnkgbmFtZSBpcyByZWxhdGl2ZSB0byB0aGUgY3VzdG9tUXVlcmllc0Rpciwgc28gaWYgeW91IHNhdmVkIGluXG4gICAqIGBxdWVyaWVzL3VzZXIvbGlzdC5zcWxgIHRoZW4sIHRoZSBpZGVudGlmaWVyIHdpbGwgYGJlIHVzZXIvbGlzdGBcbiAgICogQHBhcmFtIG5hbWUgVGhlIGlkZW50aWZpZXIgb2YgdGhlIHF1ZXJ5IHRvIGJlIGV4ZWN1dGVkXG4gICAqIEBwYXJhbSBwYXJhbXMgQW55IHBhcmFtcyBpZiBuZWVkZWQgdG8gYWRkIHRvIHRoZSBxdWVyeVxuICAgKi9cbiAgcHVibGljIGFzeW5jIGV4ZWN1dGVDdXN0b21RdWVyeTxUPihuYW1lOiBzdHJpbmcsIHBhcmFtczogYW55W10gPSBbXSk6IFByb21pc2U8YW55IHwgVD4ge1xuICAgIGNvbnN0IHF1ZXJ5ID0gdGhpcy5jdXN0b21RdWVyaWVzLmdldChuYW1lKTtcbiAgICByZXR1cm4gdGhpcy5jb25uZWN0aW9uLnF1ZXJ5KHF1ZXJ5LCBwYXJhbXMpIGFzIFQgfCBhbnk7XG4gIH1cblxuICAvKipcbiAgICogTG9hZHMgYWxsIGN1c3RvbSBxdWVyaWVzIGZyb20gdGhlIGN1c3RvbVF1ZXJpZXNEaXIgcGF0aFxuICAgKi9cbiAgcHJpdmF0ZSBsb2FkQ3VzdG9tUXVlcmllcygpOiB2b2lkIHtcbiAgICBnbG9iKHBhdGguam9pbih0aGlzLm9wdGlvbnMuY3VzdG9tUXVlcmllc0RpciwgJy4vKiovKi5zcWwnKSwgKGVyciwgbWF0Y2hlcykgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICAvLyBEbyBzb21ldGhpbmdcbiAgICAgIH1cbiAgICAgIG1hdGNoZXMuZm9yRWFjaChmaWxlUGF0aCA9PiB0aGlzLmxvYWRDdXN0b21RdWVyeShmaWxlUGF0aCkpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIGEgY3VzdG9tUXVlcnkgdG8gdGhlIG1lbW9yeVxuICAgKiBAcGFyYW0gZmlsZVBhdGggVGhlIGZpbGUgcGF0aCB0byBiZSBsb2FkZWQgaW4gbWVtb3J5XG4gICAqL1xuICBwcml2YXRlIGxvYWRDdXN0b21RdWVyeShmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgbG9jYXRpb24gPSBwYXRoLnJlbGF0aXZlKHRoaXMub3B0aW9ucy5jdXN0b21RdWVyaWVzRGlyLCBmaWxlUGF0aCk7XG4gICAgY29uc3QgbmFtZSA9IGxvY2F0aW9uLnNsaWNlKDAsIGxvY2F0aW9uLmxhc3RJbmRleE9mKCcuJykpO1xuICAgIGNvbnN0IHF1ZXJ5ID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoKS50b1N0cmluZygpO1xuICAgIHRoaXMuY3VzdG9tUXVlcmllcy5zZXQobmFtZSwgcXVlcnkpO1xuICB9XG59XG4iXX0=