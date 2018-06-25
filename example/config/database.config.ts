import * as path from 'path';

export default {
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306', 10),
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'root',
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

