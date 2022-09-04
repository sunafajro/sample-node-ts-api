import schedule from "node-schedule";
import { getDaysWeatherData } from "./jobs/getDayWeatherDataJob";

export const startGetDayWeatherDataJob = (): void => {
  schedule.scheduleJob("5 */1 * * *", async () => {
    await getDaysWeatherData();
  });
};
