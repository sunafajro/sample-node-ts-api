import * as dotenv from "dotenv";
import pgLib from "pg-promise";
import { sql } from "./helpers/SqlFileHelper";

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

// TODO Нужен полноценный функционал для миграций
export const migrate = async (db: pgLib.IDatabase<{}, any>): Promise<void> => {
  const sqlTableDayWeatherExists = sql("./sql/tableDayWeatherExists.sql");
  const result: TableExists = await db.one(sqlTableDayWeatherExists);
  if (!result.exists) {
    try {
      const sqlTableDayWeatherCreate = sql("./sql/tableDayWeatherCreate.sql");
      await db.none(sqlTableDayWeatherCreate);
    } catch (e) {
      console.log("Can't create weather table. Error: ", (e as Error).message);
      process.exit(1);
    }
  }
};
