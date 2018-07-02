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
        this.logger.silly(`${name} was added with ${query}`);
        this.customQueries.set(name, query);
    }
}
exports.EntityDatabase = EntityDatabase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDRCQUEwQjtBQUMxQixxQ0FBZ0g7QUFJaEgsc0NBQThEO0FBQzlELDZCQUE2QjtBQUM3Qix5QkFBeUI7QUFDekIsNkJBQTZCO0FBVTdCO0lBTUU7Ozs7T0FJRztJQUNILFlBQXNCLE9BQThCO1FBQTlCLFlBQU8sR0FBUCxPQUFPLENBQXVCO1FBUGpDLGtCQUFhLEdBQXdCLElBQUksR0FBRyxFQUFFLENBQUM7UUFRaEUsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLElBQUksZUFBTSxFQUFFLENBQUM7UUFFN0MsOEJBQThCO1FBQzlCLElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQztRQUNyQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUM7UUFFbEcsOEJBQThCO1FBQzlCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsaUJBQWlCLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRTtZQUM1RSxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQVcsRUFBRSxFQUFFO2dCQUNsRCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxrQ0FBa0MsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUMzRixDQUFDLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxPQUFPLENBQUMsZ0JBQWdCLEVBQUU7WUFDNUIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7U0FDMUI7SUFDSCxDQUFD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QUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLG1CQUFtQixLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN0QyxDQUFDO0NBQ0Y7QUF0R0Qsd0NBc0dDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCB7IGNyZWF0ZUNvbm5lY3Rpb24sIENvbm5lY3Rpb24sIENvbm5lY3Rpb25PcHRpb25zLCBPYmplY3RUeXBlLCBFbnRpdHlTY2hlbWEsIFJlcG9zaXRvcnkgfSBmcm9tICd0eXBlb3JtJztcbmltcG9ydCB7IE15c3FsQ29ubmVjdGlvbk9wdGlvbnMgfSBmcm9tICd0eXBlb3JtL2RyaXZlci9teXNxbC9NeXNxbENvbm5lY3Rpb25PcHRpb25zJztcbmltcG9ydCB7IFBvc3RncmVzQ29ubmVjdGlvbk9wdGlvbnMgfSBmcm9tICd0eXBlb3JtL2RyaXZlci9wb3N0Z3Jlcy9Qb3N0Z3Jlc0Nvbm5lY3Rpb25PcHRpb25zJztcbmltcG9ydCB7IFNxbGl0ZUNvbm5lY3Rpb25PcHRpb25zIH0gZnJvbSAndHlwZW9ybS9kcml2ZXIvc3FsaXRlL1NxbGl0ZUNvbm5lY3Rpb25PcHRpb25zJztcbmltcG9ydCB7IExvZ2dlciwgRGF0YWJhc2VPcHRpb25zLCBEYXRhYmFzZSB9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgZ2xvYiBmcm9tICdnbG9iJztcblxuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlEYXRhYmFzZU9wdGlvbnMgZXh0ZW5kcyBEYXRhYmFzZU9wdGlvbnMge1xuICBsb2dnZXI/OiBMb2dnZXI7XG4gIGNvbm5lY3Rpb24/OiBDb25uZWN0aW9uO1xuICBjb25uZWN0aW9uT3B0cz86IENvbm5lY3Rpb25PcHRpb25zO1xuICBjdXN0b21RdWVyaWVzRGlyPzogc3RyaW5nO1xuICBlbnRpdGllczogYW55W107XG59XG5cbmV4cG9ydCBjbGFzcyBFbnRpdHlEYXRhYmFzZSBpbXBsZW1lbnRzIERhdGFiYXNlIHtcbiAgcHJvdGVjdGVkIGxvZ2dlcjogTG9nZ2VyO1xuICBwcm90ZWN0ZWQgY29ubmVjdGlvbjogQ29ubmVjdGlvbjtcbiAgcHJvdGVjdGVkIGNvbm5lY3Rpb25PcHRpb25zOiBDb25uZWN0aW9uT3B0aW9ucztcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGN1c3RvbVF1ZXJpZXM6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgRW50aXR5IGRhdGFiYXNlIGZvciBTUUwgZHJpdmVycy5cbiAgICogXG4gICAqIEBwYXJhbSBjb25uZWN0aW9uIFRoZSBUeXBlT1JNIGNvbm5lY3Rpb24gdG8gdGhlIGRhdGFiYXNlXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgb3B0aW9uczogRW50aXR5RGF0YWJhc2VPcHRpb25zKSB7XG4gICAgdGhpcy5sb2dnZXIgPSBvcHRpb25zLmxvZ2dlciB8fCBuZXcgTG9nZ2VyKCk7XG5cbiAgICAvLyBUT0RPOiBIYW5kbGUgY29ubmVjdGlvbiB1cmxcbiAgICB0aGlzLmNvbm5lY3Rpb24gPSBvcHRpb25zLmNvbm5lY3Rpb247XG4gICAgdGhpcy5jb25uZWN0aW9uT3B0aW9ucyA9IG9wdGlvbnMuY29ubmVjdGlvbiA/IG9wdGlvbnMuY29ubmVjdGlvbi5vcHRpb25zIDogb3B0aW9ucy5jb25uZWN0aW9uT3B0cztcblxuICAgIC8vIExvZyBlbnRpdGllcyBpbml0aWFsaXphdGlvblxuICAgIGlmICh0aGlzLmxvZ2dlciAmJiB0aGlzLmNvbm5lY3Rpb25PcHRpb25zICYmIHRoaXMuY29ubmVjdGlvbk9wdGlvbnMuZW50aXRpZXMpIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbk9wdGlvbnMuZW50aXRpZXMubWFwKChFbnRpdHk6IGFueSkgPT4ge1xuICAgICAgICB0aGlzLmxvZ2dlci5zaWxseShgUmVnaXN0ZXJpbmcgbW9kZWwgaW4gZGF0YWJhc2U6ICR7RW50aXR5LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5uYW1lfWApO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmN1c3RvbVF1ZXJpZXNEaXIpIHtcbiAgICAgIHRoaXMubG9hZEN1c3RvbVF1ZXJpZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29ubmVjdHMgdG8gdGhlIGRhdGFiYXNlLCBjcmVhdGluZyBhIGNvbm5lY3Rpb24gaW5zdGFuY2UgaWYgbm90IGF2YWlsYWJsZS5cbiAgICogXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSB0byB0aGUgY29ubmVjdGlvbiBpbnN0YW5jZS5cbiAgICovXG4gIHB1YmxpYyBhc3luYyBjb25uZWN0KCk6IFByb21pc2U8RW50aXR5RGF0YWJhc2VPcHRpb25zPiB7XG4gICAgY29uc3QgeyB0eXBlLCBob3N0LCBwb3J0LCB1c2VybmFtZSwgZGF0YWJhc2UsIHN5bmNocm9uaXplIH0gPSB0aGlzLmNvbm5lY3Rpb25PcHRpb25zIGFzIGFueTtcblxuICAgIGlmICh0aGlzLmxvZ2dlcikge1xuICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ0Nvbm5lY3RpbmcgdG8gdGhlIGRhdGFiYXNlJywgeyB0eXBlLCBob3N0LCBwb3J0LCB1c2VybmFtZSwgZGF0YWJhc2UsIHN5bmNocm9uaXplIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbm5lY3Rpb24pIHtcbiAgICAgIGF3YWl0IHRoaXMuY29ubmVjdGlvbi5jb25uZWN0KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmNvbm5lY3Rpb25PcHRpb25zKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb24gPSBhd2FpdCBjcmVhdGVDb25uZWN0aW9uKHRoaXMuY29ubmVjdGlvbk9wdGlvbnMpO1xuICAgIH1cbiAgICBpZiAodGhpcy5sb2dnZXIpIHtcbiAgICAgIHRoaXMubG9nZ2VyLnNpbGx5KGBTdWNjZXNzZnVsbHkgY29ubmVjdGVkIHRvIHRoZSBkYXRhYmFzZWAsIHsgZGF0YWJhc2UgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm9wdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZGF0YWJhc2UgY3VycmVudCBzdGF0ZS5cbiAgICovXG4gIHB1YmxpYyBpc1JlYWR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24gJiYgdGhpcy5jb25uZWN0aW9uLmlzQ29ubmVjdGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc2Nvbm5lY3RzIGZyb20gZXhpc3RpbmcgY29ubmVjdGlvbiwgaWYgYW55LlxuICAgKi9cbiAgcHVibGljIGFzeW5jIGRpc2Nvbm5lY3QoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHRoaXMuY29ubmVjdGlvbikge1xuICAgICAgaWYgKHRoaXMubG9nZ2VyKSB7XG4gICAgICAgIC8vIFRPRE86IEhpZGUgYXV0aGVudGljYXRpb24gaW5mb3JtYXRpb25cbiAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ0Rpc2Nvbm5lY3RpbmcgZnJvbSBkYXRhYmFzZScsIHRoaXMuY29ubmVjdGlvbk9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgYXdhaXQgdGhpcy5jb25uZWN0aW9uLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBzaW5nbGUgcmVwb3NpdG9yeSBmcm9tIGNvbm5lY3Rpb24gbWFuYWdlci5cbiAgICogXG4gICAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBjbGFzcyBvciB0YWJsZSBuYW1lXG4gICAqL1xuICBwdWJsaWMgZ2V0UmVwb3NpdG9yeTxFbnRpdHk+KHRhcmdldDogT2JqZWN0VHlwZTxFbnRpdHk+IHwgRW50aXR5U2NoZW1hPEVudGl0eT4gfCBzdHJpbmcpOiBSZXBvc2l0b3J5PEVudGl0eT4ge1xuICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24ubWFuYWdlci5nZXRSZXBvc2l0b3J5KHRhcmdldCBhcyBhbnkpIGFzIGFueTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBleGVjdXRlQ3VzdG9tUXVlcnk8VD4obmFtZTogc3RyaW5nLCBwYXJhbXM6IGFueVtdID0gW10pOiBQcm9taXNlPGFueXxUPiB7XG4gICAgY29uc3QgcXVlcnkgPSB0aGlzLmN1c3RvbVF1ZXJpZXMuZ2V0KG5hbWUpO1xuICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24ucXVlcnkocXVlcnksIHBhcmFtcykgYXMgVHxhbnk7XG4gIH1cblxuICBwcml2YXRlIGxvYWRDdXN0b21RdWVyaWVzKCk6IHZvaWQge1xuICAgIGdsb2IocGF0aC5qb2luKHRoaXMub3B0aW9ucy5jdXN0b21RdWVyaWVzRGlyLCAnLi8qKi8qLnNxbCcpLCAoZXJyLCBtYXRjaGVzKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIC8vIERvIHNvbWV0aGluZ1xuICAgICAgfVxuICAgICAgbWF0Y2hlcy5mb3JFYWNoKGZpbGVQYXRoID0+IHRoaXMubG9hZEN1c3RvbVF1ZXJ5KGZpbGVQYXRoKSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGxvYWRDdXN0b21RdWVyeShmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgbG9jYXRpb24gPSBwYXRoLnJlbGF0aXZlKHRoaXMub3B0aW9ucy5jdXN0b21RdWVyaWVzRGlyLCBmaWxlUGF0aCk7XG4gICAgY29uc3QgbmFtZSA9IGxvY2F0aW9uLnNsaWNlKDAsIGxvY2F0aW9uLmxhc3RJbmRleE9mKCcuJykpO1xuICAgIGNvbnN0IHF1ZXJ5ID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoKS50b1N0cmluZygpO1xuICAgIHRoaXMubG9nZ2VyLnNpbGx5KGAke25hbWV9IHdhcyBhZGRlZCB3aXRoICR7cXVlcnl9YCk7XG4gICAgdGhpcy5jdXN0b21RdWVyaWVzLnNldChuYW1lLCBxdWVyeSk7XG4gIH1cbn1cbiJdfQ==