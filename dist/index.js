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
        this.entities = [];
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
                    this.entities.push(Entity);
                    this.logger.silly(`Registering model in database: ${Entity.prototype.constructor.name}`);
                }
                else {
                    this.logger.warn(`Invalid model registered in database: ${Entity}`, Entity);
                }
            });
        }
        if (this.options.customQueriesDir) {
            this.loadCustomQueries();
        }
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
            name: this.options.name || 'EntityDatabase',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDRCQUEwQjtBQUMxQiw2QkFBNkI7QUFDN0IseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QixxQ0FHaUI7QUFJakIsNkRBQW9GO0FBVXBGLE1BQWEsY0FBZSxTQUFRLDhCQUFRO0lBTzFDOzs7O09BSUc7SUFDSCxZQUFtQixPQUE4QjtRQUMvQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFERSxZQUFPLEdBQVAsT0FBTyxDQUF1QjtRQVR2QyxhQUFRLEdBQWlCLEVBQUUsQ0FBQztRQUVuQixrQkFBYSxHQUF3QixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBVWhFLDhCQUE4QjtRQUM5QixJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFDckMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO0lBQ3BHLENBQUM7SUFFRDs7OztPQUlHO0lBQ1UsT0FBTzs7WUFDbEIsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLGlCQUF3QixDQUFDO1lBRTVGLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDZixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQzthQUN4RztZQUVELElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDbkIsTUFBTSxJQUFJLENBQUMsVUFBVSxD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VSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFZLENBQUM7UUFDekQsQ0FBQztLQUFBO0lBRUQ7O09BRUc7SUFDSyxpQkFBaUI7UUFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUM1RSxJQUFJLEdBQUcsRUFBRTtnQkFDUCxlQUFlO2FBQ2hCO1lBQ0QsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUM5RCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7O09BR0c7SUFDSyxlQUFlLENBQUMsUUFBZ0I7UUFDdEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMxRCxNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ25ELElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN0QyxDQUFDO0NBQ0Y7QUEzSUQsd0NBMklDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdyZWZsZWN0LW1ldGFkYXRhJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0IHtcbiAgY3JlYXRlQ29ubmVjdGlvbiwgQ29ubmVjdGlvbiwgQ29ubmVjdGlvbk9wdGlvbnMsXG4gIE9iamVjdFR5cGUsIEVudGl0eVNjaGVtYSwgUmVwb3NpdG9yeSwgQmFzZUVudGl0eSxcbn0gZnJvbSAndHlwZW9ybSc7XG5pbXBvcnQgeyBNeXNxbENvbm5lY3Rpb25PcHRpb25zIH0gZnJvbSAndHlwZW9ybS9kcml2ZXIvbXlzcWwvTXlzcWxDb25uZWN0aW9uT3B0aW9ucyc7XG5pbXBvcnQgeyBQb3N0Z3Jlc0Nvbm5lY3Rpb25PcHRpb25zIH0gZnJvbSAndHlwZW9ybS9kcml2ZXIvcG9zdGdyZXMvUG9zdGdyZXNDb25uZWN0aW9uT3B0aW9ucyc7XG5pbXBvcnQgeyBTcWxpdGVDb25uZWN0aW9uT3B0aW9ucyB9IGZyb20gJ3R5cGVvcm0vZHJpdmVyL3NxbGl0ZS9TcWxpdGVDb25uZWN0aW9uT3B0aW9ucyc7XG5pbXBvcnQgeyBMb2dnZXIsIERhdGFiYXNlT3B0aW9ucywgRGF0YWJhc2UsIEJhc2VTZXJ2ZXIgfSBmcm9tICd0cy1mcmFtZXdvcmstY29tbW9uJztcblxuZXhwb3J0IGludGVyZmFjZSBFbnRpdHlEYXRhYmFzZU9wdGlvbnMgZXh0ZW5kcyBEYXRhYmFzZU9wdGlvbnMge1xuICBsb2dnZXI/OiBMb2dnZXI7XG4gIGNvbm5lY3Rpb24/OiBDb25uZWN0aW9uO1xuICBjb25uZWN0aW9uT3B0cz86IENvbm5lY3Rpb25PcHRpb25zO1xuICBjdXN0b21RdWVyaWVzRGlyPzogc3RyaW5nO1xuICBlbnRpdGllczogYW55W107XG59XG5cbmV4cG9ydCBjbGFzcyBFbnRpdHlEYXRhYmFzZSBleHRlbmRzIERhdGFiYXNlIHtcbiAgcHVibGljIGxvZ2dlcjogTG9nZ2VyO1xuICBwcm90ZWN0ZWQgY29ubmVjdGlvbjogQ29ubmVjdGlvbjtcbiAgcHJvdGVjdGVkIGVudGl0aWVzOiBCYXNlRW50aXR5W10gPSBbXTtcbiAgcHJvdGVjdGVkIGNvbm5lY3Rpb25PcHRpb25zOiBDb25uZWN0aW9uT3B0aW9ucztcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGN1c3RvbVF1ZXJpZXM6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgRW50aXR5IGRhdGFiYXNlIGZvciBTUUwgZHJpdmVycy5cbiAgICogXG4gICAqIEBwYXJhbSBjb25uZWN0aW9uIFRoZSBUeXBlT1JNIGNvbm5lY3Rpb24gdG8gdGhlIGRhdGFiYXNlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgb3B0aW9uczogRW50aXR5RGF0YWJhc2VPcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucyk7XG5cbiAgICAvLyBUT0RPOiBIYW5kbGUgY29ubmVjdGlvbiB1cmxcbiAgICB0aGlzLmNvbm5lY3Rpb24gPSBvcHRpb25zLmNvbm5lY3Rpb247XG4gICAgdGhpcy5jb25uZWN0aW9uT3B0aW9ucyA9IG9wdGlvbnMuY29ubmVjdGlvbiA/IG9wdGlvbnMuY29ubmVjdGlvbi5vcHRpb25zIDogb3B0aW9ucy5jb25uZWN0aW9uT3B0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25uZWN0cyB0byB0aGUgZGF0YWJhc2UsIGNyZWF0aW5nIGEgY29ubmVjdGlvbiBpbnN0YW5jZSBpZiBub3QgYXZhaWxhYmxlLlxuICAgKiBcbiAgICogQHJldHVybnMgQSBwcm9taXNlIHRvIHRoZSBjb25uZWN0aW9uIGluc3RhbmNlLlxuICAgKi9cbiAgcHVibGljIGFzeW5jIGNvbm5lY3QoKTogUHJvbWlzZTxFbnRpdHlEYXRhYmFzZU9wdGlvbnM+IHtcbiAgICBjb25zdCB7IHR5cGUsIGhvc3QsIHBvcnQsIHVzZXJuYW1lLCBkYXRhYmFzZSwgc3luY2hyb25pemUgfSA9IHRoaXMuY29ubmVjdGlvbk9wdGlvbnMgYXMgYW55O1xuXG4gICAgaWYgKHRoaXMubG9nZ2VyKSB7XG4gICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnQ29ubmVjdGluZyB0byB0aGUgZGF0YWJhc2UnLCB7IHR5cGUsIGhvc3QsIHBvcnQsIHVzZXJuYW1lLCBkYXRhYmFzZSwgc3luY2hyb25pemUgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29ubmVjdGlvbikge1xuICAgICAgYXdhaXQgdGhpcy5jb25uZWN0aW9uLmNvbm5lY3QoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY29ubmVjdGlvbk9wdGlvbnMpIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbiA9IGF3YWl0IGNyZWF0ZUNvbm5lY3Rpb24odGhpcy5jb25uZWN0aW9uT3B0aW9ucyk7XG4gICAgfVxuICAgIGlmICh0aGlzLmxvZ2dlcikge1xuICAgICAgdGhpcy5sb2dnZXIuc2lsbHkoYFN1Y2Nlc3NmdWxseSBjb25uZWN0ZWQgdG8gdGhlIGRhdGFiYXNlYCwgeyBkYXRhYmFzZSB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucztcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGVzIHRoZSBkYXRhYmFzZSBtb3VudGluZyByb3V0aW5lcy5cbiAgICovXG4gIG9uTW91bnQoKTogdm9pZCB7XG4gICAgLy8gTG9nIGVudGl0aWVzIGluaXRpYWxpemF0aW9uXG4gICAgaWYgKHRoaXMubG9nZ2VyICYmIHRoaXMuY29ubmVjdGlvbk9wdGlvbnMgJiYgdGhpcy5jb25uZWN0aW9uT3B0aW9ucy5lbnRpdGllcykge1xuICAgICAgdGhpcy5jb25uZWN0aW9uT3B0aW9ucy5lbnRpdGllcy5tYXAoKEVudGl0eTogYW55KSA9PiB7XG4gICAgICAgIGlmIChFbnRpdHkgJiYgRW50aXR5LnByb3RvdHlwZSAmJiBFbnRpdHkucHJvdG90eXBlLmNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgdGhpcy5lbnRpdGllcy5wdXNoKEVudGl0eSk7XG4gICAgICAgICAgdGhpcy5sb2dnZXIuc2lsbHkoYFJlZ2lzdGVyaW5nIG1vZGVsIGluIGRhdGFiYXNlOiAke0VudGl0eS5wcm90b3R5cGUuY29uc3RydWN0b3IubmFtZX1gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmxvZ2dlci53YXJuKGBJbnZhbGlkIG1vZGVsIHJlZ2lzdGVyZWQgaW4gZGF0YWJhc2U6ICR7RW50aXR5fWAsIEVudGl0eSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodGhpcy5vcHRpb25zLmN1c3RvbVF1ZXJpZXNEaXIpIHtcbiAgICAgIHRoaXMubG9hZEN1c3RvbVF1ZXJpZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZGF0YWJhc2UgY3VycmVudCBzdGF0ZS5cbiAgICovXG4gIHB1YmxpYyBpc1JlYWR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24gJiYgdGhpcy5jb25uZWN0aW9uLmlzQ29ubmVjdGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIERlc2NyaWJlIGRhdGFiYXNlIHN0YXR1cyBhbmQgZW50aXRpZXMuXG4gICAqL1xuICBwdWJsaWMgZGVzY3JpYmUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IHRoaXMub3B0aW9ucy5uYW1lIHx8ICdFbnRpdHlEYXRhYmFzZScsXG4gICAgICBpc1JlYWR5OiB0aGlzLmlzUmVhZHkoKSxcbiAgICAgIGVudGl0aWVzOiB0aGlzLmVudGl0aWVzLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogRGlzY29ubmVjdHMgZnJvbSBleGlzdGluZyBjb25uZWN0aW9uLCBpZiBhbnkuXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZGlzY29ubmVjdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IHR5cGUsIGhvc3QsIHBvcnQsIHVzZXJuYW1lLCBkYXRhYmFzZSwgc3luY2hyb25pemUgfSA9IHRoaXMuY29ubmVjdGlvbk9wdGlvbnMgYXMgYW55O1xuXG4gICAgaWYgKHRoaXMuY29ubmVjdGlvbikge1xuICAgICAgaWYgKHRoaXMubG9nZ2VyKSB7XG4gICAgICAgIC8vIFRPRE86IEhpZGUgYXV0aGVudGljYXRpb24gaW5mb3JtYXRpb25cbiAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ0Rpc2Nvbm5lY3RpbmcgZnJvbSBkYXRhYmFzZScsIHsgaG9zdCwgcG9ydCwgdXNlcm5hbWUsIGRhdGFiYXNlIH0pO1xuICAgICAgfVxuICAgICAgYXdhaXQgdGhpcy5jb25uZWN0aW9uLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBzaW5nbGUgcmVwb3NpdG9yeSBmcm9tIGNvbm5lY3Rpb24gbWFuYWdlci5cbiAgICogXG4gICAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBjbGFzcyBvciB0YWJsZSBuYW1lXG4gICAqL1xuICBwdWJsaWMgZ2V0UmVwb3NpdG9yeTxFbnRpdHk+KHRhcmdldDogT2JqZWN0VHlwZTxFbnRpdHk+IHwgRW50aXR5U2NoZW1hPEVudGl0eT4gfCBzdHJpbmcpOiBSZXBvc2l0b3J5PEVudGl0eT4ge1xuICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24ubWFuYWdlci5nZXRSZXBvc2l0b3J5KHRhcmdldCBhcyBhbnkpIGFzIGFueTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlcyBhIHByZSBsb2FkZWQgcXVlcnkgZnJvbSB0aGUgcXVlcmllcyBkaXJlY3RvcnlcbiAgICogVGhlIHF1ZXJ5IG5hbWUgaXMgcmVsYXRpdmUgdG8gdGhlIGN1c3RvbVF1ZXJpZXNEaXIsIHNvIGlmIHlvdSBzYXZlZCBpblxuICAgKiBgcXVlcmllcy91c2VyL2xpc3Quc3FsYCB0aGVuLCB0aGUgaWRlbnRpZmllciB3aWxsIGBiZSB1c2VyL2xpc3RgXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBpZGVudGlmaWVyIG9mIHRoZSBxdWVyeSB0byBiZSBleGVjdXRlZFxuICAgKiBAcGFyYW0gcGFyYW1zIEFueSBwYXJhbXMgaWYgbmVlZGVkIHRvIGFkZCB0byB0aGUgcXVlcnlcbiAgICovXG4gIHB1YmxpYyBhc3luYyBleGVjdXRlQ3VzdG9tUXVlcnk8VD4obmFtZTogc3RyaW5nLCBwYXJhbXM6IGFueVtdID0gW10pOiBQcm9taXNlPGFueSB8IFQ+IHtcbiAgICBjb25zdCBxdWVyeSA9IHRoaXMuY3VzdG9tUXVlcmllcy5nZXQobmFtZSk7XG4gICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5xdWVyeShxdWVyeSwgcGFyYW1zKSBhcyBUIHwgYW55O1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIGFsbCBjdXN0b20gcXVlcmllcyBmcm9tIHRoZSBjdXN0b21RdWVyaWVzRGlyIHBhdGhcbiAgICovXG4gIHByaXZhdGUgbG9hZEN1c3RvbVF1ZXJpZXMoKTogdm9pZCB7XG4gICAgZ2xvYihwYXRoLmpvaW4odGhpcy5vcHRpb25zLmN1c3RvbVF1ZXJpZXNEaXIsICcuLyoqLyouc3FsJyksIChlcnIsIG1hdGNoZXMpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgLy8gRG8gc29tZXRoaW5nXG4gICAgICB9XG4gICAgICBtYXRjaGVzLmZvckVhY2goZmlsZVBhdGggPT4gdGhpcy5sb2FkQ3VzdG9tUXVlcnkoZmlsZVBhdGgpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkcyBhIGN1c3RvbVF1ZXJ5IHRvIHRoZSBtZW1vcnlcbiAgICogQHBhcmFtIGZpbGVQYXRoIFRoZSBmaWxlIHBhdGggdG8gYmUgbG9hZGVkIGluIG1lbW9yeVxuICAgKi9cbiAgcHJpdmF0ZSBsb2FkQ3VzdG9tUXVlcnkoZmlsZVBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IGxvY2F0aW9uID0gcGF0aC5yZWxhdGl2ZSh0aGlzLm9wdGlvbnMuY3VzdG9tUXVlcmllc0RpciwgZmlsZVBhdGgpO1xuICAgIGNvbnN0IG5hbWUgPSBsb2NhdGlvbi5zbGljZSgwLCBsb2NhdGlvbi5sYXN0SW5kZXhPZignLicpKTtcbiAgICBjb25zdCBxdWVyeSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCkudG9TdHJpbmcoKTtcbiAgICB0aGlzLmN1c3RvbVF1ZXJpZXMuc2V0KG5hbWUsIHF1ZXJ5KTtcbiAgfVxufVxuIl19