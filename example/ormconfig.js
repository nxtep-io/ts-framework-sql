export default {
  type: "mysql",
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT || 3306,
  username: process.env.DATABASE_PORT || 'postgres',
  password: "u36ibd2so8tqem1g",
  database: "jais64g8sx083zao",
  synchronize: true,
  logging: false,
  entities: [
    "api/entities/**/*.ts"
  ],
  migrations: [
    "api/migration/**/*.ts"
  ],
  subscribers: [
    "api/subscriber/**/*.ts"
  ],
  cli: {
    entitiesDir: "api/models",
    migrationsDir: "api/migration",
    subscribersDir: "api/sub scriber"
  }
};
