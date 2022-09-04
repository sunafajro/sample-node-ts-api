import schedule from "node-schedule";
import { getDaysWeatherData } from "./jobs/getDayWeatherDataJob";

// Для исключения двух одновременных запросов
let loading = false;

export const startGetDayWeatherDataJob = async (): Promise<void> => {
  // Чтобы сразу запросить данные не ожидая срабатывания планировщика
  loading = true;
  await getDaysWeatherData();
  loading = false;

  // включаем обработку задачи на 05 мин каждого часа
  schedule.scheduleJob("5 */1 * * *", async () => {
    if (!loading) {
      loading = true;
      await getDaysWeatherData();
      loading = false;
    }
  });
};
