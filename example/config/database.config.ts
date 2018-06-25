const type = 'mysql';

export default {
  type,
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306', 10),
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'root',
  database: 'example_sql',
  synchronize: true,
  logging: false,
  entities: [
    'api/models/**/*.ts',
  ],
  migrations: [
    'api/migration/**/*.ts',
  ],
  subscribers: [
    'api/subscriber/**/*.ts',
  ],
  cli: {
    entitiesDir: 'api/models',
    migrationsDir: 'api/migration',
    subscribersDir: 'api/sub scriber',
  },
};

