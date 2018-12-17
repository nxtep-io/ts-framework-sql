ts-framework-sql
================

A minimalistic framework for typescript based applications, with async/await and decorators support.

This plugin extends the [Server](https://github.com/devnup/ts-framework) for handling a SQL database using [TypeORM](https://github.com/typeorm/typeorm) and [Knex.js](https://github.com/tgriesser/knex).

## Getting Started

Create a new Database class to handle your entities and connections.

```typescript
import Config from '../config';
import { Database } from 'ts-framework-sql';

export default class MainDatabase extends Database {
  constructor() {
    super({
      type: "postgres",
      logging: ["error"],
      host: process.env.DATABASE_HOST || "localhost",
      port: process.env.DATABASE_PORT || "5432",
      username: process.env.DATABASE_USER || "postgres",
      password: process.env.DATABASE_PASSWORD || "postgres",
      database: process.env.DATABASE_NAME || "test",

      // IMPORTANT: Path should be relative to root
      entities: ["./api/models/**/*.ts"],
      migrations: ["./api/migrations/**/*.ts"],
      cli: {
        // IMPORTANT: Path should be relative to root
        entitiesDir: "./api/models",
        migrationsDir: "./api/migrations"
      }
    })
  }
}
```

Now, you can bind the database initialization to the TS Framework Server instance.

```typescript
import { Server, ServerOptions, Logger } from 'ts-framework/server';
import { StatusController } from './controllers/StatusController'
import MainDatabase from './database';

// Prepare the database to be connected later
const database = new MainDatabase();

export default class MainServer extends Server {
  constructor(options: ServerOptions) {
    super({
      port: process.env.PORT || 3000,
      controllers: { status: StatusController },
      // Database will be initialized in the Server lifecycle
      children: [database],
      ...options
    });
  }
} 
```

**Create your first model**

```typescript
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  isActive: boolean;

}
```

For more information, refer to the [Entities](https://github.com/typeorm/typeorm/blob/master/docs/entities.md) documentation in the TypeORM [repository]((https://github.com/typeorm/typeorm).

<br />

## License

The project is licensed under the [MIT License](./LICENSE.md).
