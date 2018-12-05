import * as path from 'path';

export default {
  name: 'default',
  type: "sqlite",
  storage: "temp/sqlitedb.db",
  database: 'example_sql',
  synchronize: false,
  logging: false,
  entities: ['api/models/*.ts'],
  migrations: ['api/migrations/*.ts'],
  cli: {
    entitiesDir: './api/models',
    migrationsDir: './api/migrations',
  },
};

