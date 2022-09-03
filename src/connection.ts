import pgPromise from "pg-promise";

const pg = pgPromise({});

const {dbHost, dbPort, dbName, dbUser, dbPass } = process.env;

if (!dbName || !dbPort || !dbName || !dbUser || !dbPass) {
  console.log("No database config defined.");
  process.exit(1);
}

export const db = pg(
  `postgres://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`
);
