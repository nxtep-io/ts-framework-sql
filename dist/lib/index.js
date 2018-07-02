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
                this.logger.silly(`Registering model in database: ${Entity.prototype.constructor.name}`);
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
    executeCustomQuery(name, params = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.customQueries.get(name);
            return this.connection.query(query, params);
        });
    }
    loadCustomQueries() {
        glob(path.join(this.options.customQueriesDir, './**/*.sql'), (err, matches) => {
            if (err) {
                // Do something
            }
            matches.forEach(filePath => this.loadCustomQuery(filePath));
        });
    }
    loadCustomQuery(filePath) {
        const location = path.relative(this.options.customQueriesDir, filePath);
        const name = location.slice(0, location.lastIndexOf('.'));
        const query = fs.readFileSync(filePath).toString();
        this.customQueries.set(name, query);
    }
}
exports.EntityDatabase = EntityDatabase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDRCQUEwQjtBQUMxQixxQ0FBZ0g7QUFJaEgsc0NBQThEO0FBQzlELDZCQUE2QjtBQUM3Qix5QkFBeUI7QUFDekIsNkJBQTZCO0FBVTdCO0lBTUU7Ozs7T0FJRztJQUNILFlBQXNCLE9BQThCO1FBQTlCLFlBQU8sR0FBUCxPQUFPLENBQXVCO1FBUGpDLGtCQUFhLEdBQXdCLElBQUksR0FBRyxFQUFFLENBQUM7UUFRaEUsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLElBQUksZUFBTSxFQUFFLENBQUM7UUFFN0MsOEJBQThCO1FBQzlCLElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQztRQUNyQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUM7UUFFbEcsOEJBQThCO1FBQzlCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsaUJBQWlCLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRTtZQUM1RSxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQVcsRUFBRSxFQUFFO2dCQUNsRCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxrQ0FBa0MsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUMzRixDQUFDLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxPQUFPLENBQUMsZ0JBQWdCLEVBQUU7WUFDNUIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7U0FDMUI7SUFDSCxDQUFD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QUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3RDLENBQUM7Q0FDRjtBQXJHRCx3Q0FxR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ3JlZmxlY3QtbWV0YWRhdGEnO1xuaW1wb3J0IHsgY3JlYXRlQ29ubmVjdGlvbiwgQ29ubmVjdGlvbiwgQ29ubmVjdGlvbk9wdGlvbnMsIE9iamVjdFR5cGUsIEVudGl0eVNjaGVtYSwgUmVwb3NpdG9yeSB9IGZyb20gJ3R5cGVvcm0nO1xuaW1wb3J0IHsgTXlzcWxDb25uZWN0aW9uT3B0aW9ucyB9IGZyb20gJ3R5cGVvcm0vZHJpdmVyL215c3FsL015c3FsQ29ubmVjdGlvbk9wdGlvbnMnO1xuaW1wb3J0IHsgUG9zdGdyZXNDb25uZWN0aW9uT3B0aW9ucyB9IGZyb20gJ3R5cGVvcm0vZHJpdmVyL3Bvc3RncmVzL1Bvc3RncmVzQ29ubmVjdGlvbk9wdGlvbnMnO1xuaW1wb3J0IHsgU3FsaXRlQ29ubmVjdGlvbk9wdGlvbnMgfSBmcm9tICd0eXBlb3JtL2RyaXZlci9zcWxpdGUvU3FsaXRlQ29ubmVjdGlvbk9wdGlvbnMnO1xuaW1wb3J0IHsgTG9nZ2VyLCBEYXRhYmFzZU9wdGlvbnMsIERhdGFiYXNlIH0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBnbG9iIGZyb20gJ2dsb2InO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVudGl0eURhdGFiYXNlT3B0aW9ucyBleHRlbmRzIERhdGFiYXNlT3B0aW9ucyB7XG4gIGxvZ2dlcj86IExvZ2dlcjtcbiAgY29ubmVjdGlvbj86IENvbm5lY3Rpb247XG4gIGNvbm5lY3Rpb25PcHRzPzogQ29ubmVjdGlvbk9wdGlvbnM7XG4gIGN1c3RvbVF1ZXJpZXNEaXI/OiBzdHJpbmc7XG4gIGVudGl0aWVzOiBhbnlbXTtcbn1cblxuZXhwb3J0IGNsYXNzIEVudGl0eURhdGFiYXNlIGltcGxlbWVudHMgRGF0YWJhc2Uge1xuICBwcm90ZWN0ZWQgbG9nZ2VyOiBMb2dnZXI7XG4gIHByb3RlY3RlZCBjb25uZWN0aW9uOiBDb25uZWN0aW9uO1xuICBwcm90ZWN0ZWQgY29ubmVjdGlvbk9wdGlvbnM6IENvbm5lY3Rpb25PcHRpb25zO1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgY3VzdG9tUXVlcmllczogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBFbnRpdHkgZGF0YWJhc2UgZm9yIFNRTCBkcml2ZXJzLlxuICAgKiBcbiAgICogQHBhcmFtIGNvbm5lY3Rpb24gVGhlIFR5cGVPUk0gY29ubmVjdGlvbiB0byB0aGUgZGF0YWJhc2VcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBvcHRpb25zOiBFbnRpdHlEYXRhYmFzZU9wdGlvbnMpIHtcbiAgICB0aGlzLmxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyIHx8IG5ldyBMb2dnZXIoKTtcblxuICAgIC8vIFRPRE86IEhhbmRsZSBjb25uZWN0aW9uIHVybFxuICAgIHRoaXMuY29ubmVjdGlvbiA9IG9wdGlvbnMuY29ubmVjdGlvbjtcbiAgICB0aGlzLmNvbm5lY3Rpb25PcHRpb25zID0gb3B0aW9ucy5jb25uZWN0aW9uID8gb3B0aW9ucy5jb25uZWN0aW9uLm9wdGlvbnMgOiBvcHRpb25zLmNvbm5lY3Rpb25PcHRzO1xuXG4gICAgLy8gTG9nIGVudGl0aWVzIGluaXRpYWxpemF0aW9uXG4gICAgaWYgKHRoaXMubG9nZ2VyICYmIHRoaXMuY29ubmVjdGlvbk9wdGlvbnMgJiYgdGhpcy5jb25uZWN0aW9uT3B0aW9ucy5lbnRpdGllcykge1xuICAgICAgdGhpcy5jb25uZWN0aW9uT3B0aW9ucy5lbnRpdGllcy5tYXAoKEVudGl0eTogYW55KSA9PiB7XG4gICAgICAgIHRoaXMubG9nZ2VyLnNpbGx5KGBSZWdpc3RlcmluZyBtb2RlbCBpbiBkYXRhYmFzZTogJHtFbnRpdHkucHJvdG90eXBlLmNvbnN0cnVjdG9yLm5hbWV9YCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuY3VzdG9tUXVlcmllc0Rpcikge1xuICAgICAgdGhpcy5sb2FkQ3VzdG9tUXVlcmllcygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDb25uZWN0cyB0byB0aGUgZGF0YWJhc2UsIGNyZWF0aW5nIGEgY29ubmVjdGlvbiBpbnN0YW5jZSBpZiBub3QgYXZhaWxhYmxlLlxuICAgKiBcbiAgICogQHJldHVybnMgQSBwcm9taXNlIHRvIHRoZSBjb25uZWN0aW9uIGluc3RhbmNlLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIGNvbm5lY3QoKTogUHJvbWlzZTxFbnRpdHlEYXRhYmFzZU9wdGlvbnM+IHtcbiAgICBjb25zdCB7IHR5cGUsIGhvc3QsIHBvcnQsIHVzZXJuYW1lLCBkYXRhYmFzZSwgc3luY2hyb25pemUgfSA9IHRoaXMuY29ubmVjdGlvbk9wdGlvbnMgYXMgYW55O1xuXG4gICAgaWYgKHRoaXMubG9nZ2VyKSB7XG4gICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnQ29ubmVjdGluZyB0byB0aGUgZGF0YWJhc2UnLCB7IHR5cGUsIGhvc3QsIHBvcnQsIHVzZXJuYW1lLCBkYXRhYmFzZSwgc3luY2hyb25pemUgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29ubmVjdGlvbikge1xuICAgICAgYXdhaXQgdGhpcy5jb25uZWN0aW9uLmNvbm5lY3QoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29ubmVjdGlvbk9wdGlvbnMpIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbiA9IGF3YWl0IGNyZWF0ZUNvbm5lY3Rpb24odGhpcy5jb25uZWN0aW9uT3B0aW9ucyk7XG4gICAgfVxuICAgIGlmICh0aGlzLmxvZ2dlcikge1xuICAgICAgdGhpcy5sb2dnZXIuc2lsbHkoYFN1Y2Nlc3NmdWxseSBjb25uZWN0ZWQgdG8gdGhlIGRhdGFiYXNlYCwgeyBkYXRhYmFzZSB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBkYXRhYmFzZSBjdXJyZW50IHN0YXRlLlxuICAgKi9cbiAgcHVibGljIGlzUmVhZHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbiAmJiB0aGlzLmNvbm5lY3Rpb24uaXNDb25uZWN0ZWQ7XG4gIH1cblxuICAvKipcbiAgICogRGlzY29ubmVjdHMgZnJvbSBleGlzdGluZyBjb25uZWN0aW9uLCBpZiBhbnkuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZGlzY29ubmVjdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAodGhpcy5jb25uZWN0aW9uKSB7XG4gICAgICBpZiAodGhpcy5sb2dnZXIpIHtcbiAgICAgICAgLy8gVE9ETzogSGlkZSBhdXRoZW50aWNhdGlvbiBpbmZvcm1hdGlvblxuICAgICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnRGlzY29ubmVjdGluZyBmcm9tIGRhdGFiYXNlJywgdGhpcy5jb25uZWN0aW9uT3B0aW9ucyk7XG4gICAgICB9XG4gICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHNpbmdsZSByZXBvc2l0b3J5IGZyb20gY29ubmVjdGlvbiBtYW5hZ2VyLlxuICAgKiBcbiAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IGNsYXNzIG9yIHRhYmxlIG5hbWVcbiAgICovXG4gIHB1YmxpYyBnZXRSZXBvc2l0b3J5PEVudGl0eT4odGFyZ2V0OiBPYmplY3RUeXBlPEVudGl0eT4gfCBFbnRpdHlTY2hlbWE8RW50aXR5PiB8IHN0cmluZyk6IFJlcG9zaXRvcnk8RW50aXR5PiB7XG4gICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5tYW5hZ2VyLmdldFJlcG9zaXRvcnkodGFyZ2V0IGFzIGFueSkgYXMgYW55O1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGV4ZWN1dGVDdXN0b21RdWVyeTxUPihuYW1lOiBzdHJpbmcsIHBhcmFtczogYW55W10gPSBbXSk6IFByb21pc2U8YW55fFQ+IHtcbiAgICBjb25zdCBxdWVyeSA9IHRoaXMuY3VzdG9tUXVlcmllcy5nZXQobmFtZSk7XG4gICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5xdWVyeShxdWVyeSwgcGFyYW1zKSBhcyBUfGFueTtcbiAgfVxuXG4gIHByaXZhdGUgbG9hZEN1c3RvbVF1ZXJpZXMoKTogdm9pZCB7XG4gICAgZ2xvYihwYXRoLmpvaW4odGhpcy5vcHRpb25zLmN1c3RvbVF1ZXJpZXNEaXIsICcuLyoqLyouc3FsJyksIChlcnIsIG1hdGNoZXMpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgLy8gRG8gc29tZXRoaW5nXG4gICAgICB9XG4gICAgICBtYXRjaGVzLmZvckVhY2goZmlsZVBhdGggPT4gdGhpcy5sb2FkQ3VzdG9tUXVlcnkoZmlsZVBhdGgpKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgbG9hZEN1c3RvbVF1ZXJ5KGZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBsb2NhdGlvbiA9IHBhdGgucmVsYXRpdmUodGhpcy5vcHRpb25zLmN1c3RvbVF1ZXJpZXNEaXIsIGZpbGVQYXRoKTtcbiAgICBjb25zdCBuYW1lID0gbG9jYXRpb24uc2xpY2UoMCwgbG9jYXRpb24ubGFzdEluZGV4T2YoJy4nKSk7XG4gICAgY29uc3QgcXVlcnkgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgpLnRvU3RyaW5nKCk7XG4gICAgdGhpcy5jdXN0b21RdWVyaWVzLnNldChuYW1lLCBxdWVyeSk7XG4gIH1cbn1cbiJdfQ==