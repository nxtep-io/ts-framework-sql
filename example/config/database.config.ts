import * as path from 'path';

export default {
  type: "sqlite",
  storage: "temp/sqlitedb.db",
  database: 'example_sql',
  synchronize: true,
  logging: false,
  entities: [
    path.join(__dirname, '../api/models/**/*.ts'),
  ],
  migrations: [
    path.join(__dirname, '../api/migrations/**/*.ts'),
  ],
  subscribers: [
    path.join(__dirname, '../api/subscribers/**/*.ts'),
  ],
  cli: {
    entitiesDir: path.join(__dirname, '../api/models/**/*.ts'),
    migrationsDir: path.join(__dirname, '../api/migrations/**/*.ts'),
    subscribersDir: path.join(__dirname, '../api/subscribers/**/*.ts'),
  },
};

