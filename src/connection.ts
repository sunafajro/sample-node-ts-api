import pgPromise from "pg-promise";

const pg = pgPromise({});

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

if (!dbName || !dbPort || !dbName || !dbUser || !dbPass) {
  console.log("No database config defined.");
  process.exit(1);
}

export const db = pg(
  `postgres://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`
);
