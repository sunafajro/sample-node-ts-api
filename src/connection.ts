import * as dotenv from "dotenv";
import pgLib from "pg-promise";

const pgp = pgLib({});

dotenv.config();

let db: pgLib.IDatabase<{}, any> | null = null;

interface TableExists {
  exists: boolean;
}

export const connectDb = (): pgLib.IDatabase<{}, any> => {
  if (!db) {
    const {
      DB_HOST: dbHost,
      DB_PORT: dbPort,
      DB_NAME: dbName,
      DB_USER: dbUser,
      DB_PASS: dbPass,
    } = process.env;

    if (!dbName || !dbPort || !dbName || !dbUser || !dbPass) {
      console.log("No database config defined.");
      process.exit(1);
    }

    db = pgp(`postgres://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`);
  }

  return db;
};

export const migrate = async (db: pgLib.IDatabase<{}, any>): Promise<void> => {
  const result: TableExists = await db.one(
    "\
    SELECT EXISTS (\
      SELECT FROM information_schema.tables\
      WHERE table_schema = 'public'\
        AND table_name = 'day_weather'\
    );\
  "
  );
  if (!result.exists) {
    try {
      // TODO Нужен полноценный функционал для миграций
      await db.none("\
        CREATE TABLE day_weather (\
          id serial PRIMARY KEY,\
          date date NOT NULL,\
          lat float NOT NULL,\
          lng float NOT NULL,\
          address varchar(255) NOT NULL,\
          temp_max float NOT NULL,\
          temp_min float NOT NULL,\
          temp float NOT NULL,\
          created_at timestamp NOT NULL,\
          updated_at timestamp NOT NULL\
        )\
      ");
    } catch (e) {
      console.log("Can't create weather table. Error: ", (e as Error).message);
      process.exit(1);
    }
  }
};
