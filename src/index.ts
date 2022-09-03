import * as dotenv from "dotenv";
import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { connectDb, migrate } from "./connection";
import { createAndStartJob } from "./scheduler";
import * as SiteController from "./controllers/SiteController";
import * as DayWeatherController from "./controllers/DayWeatherController";
import pgLib from "pg-promise";

dotenv.config();

const db: pgLib.IDatabase<{}, any> = connectDb();

db.connect()
  .then((obj) => {
    obj.done();
    migrate(db);
  })
  .catch((e) => {
    console.log("Connect to db failed. Error:", (e as Error).message);
    process.exit(1);
  });

if (!process.env.APP_PORT) {
  console.log("No app port defined.");
  process.exit(1);
}

const PORT: number = parseInt(process.env.APP_PORT as string, 10);

const app: Express = express();

app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

app.use("", SiteController.default, DayWeatherController.default);

createAndStartJob(db, process.env);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
