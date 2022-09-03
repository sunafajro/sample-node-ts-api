import schedule from "node-schedule";
import pgLib from "pg-promise";
import axios, { AxiosResponse } from "axios";

interface UrlPartsInterface {
  vcUrl: string;
  vcUnitGroup?: string;
  vcKey: string;
  vcInclude?: string;
  vcContentType?: string;
}

interface WeatherResponseData {
  latitude: string;
  longitude: string;
  address: string;
  days: WeatherDayResponseData[];
}

interface WeatherDayResponseData {
  datetime: string;
  tempmax: number;
  tempmin: number;
  temp: number;
}

interface DayRecord {
  id: number;
}

const prepareUrl = ({
  vcUrl,
  vcUnitGroup,
  vcKey,
  vcInclude,
  vcContentType,
}: UrlPartsInterface) => {
  let url = `${vcUrl}/?&key=${vcKey}`;
  if (vcUnitGroup) {
    url += `&unitGroup=${vcUnitGroup}`;
  }
  if (vcInclude) {
    url += `&include=${vcInclude}`;
  }
  if (vcContentType) {
    url += `&contentType=${vcContentType}`;
  }

  return url;
};

export const createAndStartJob = (
  db: pgLib.IDatabase<{}, any>,
  env: NodeJS.ProcessEnv
): void => {
  schedule.scheduleJob("10 */1 * * *", async () => {
    console.log("Getting weather data...");

    const {
      VC_URL: vcUrl,
      VC_KEY: vcKey,
      VC_UNIT_GROUP: vcUnitGroup,
      VC_INCLUDE: vcInclude,
      VC_CONTENT_TYPE: vcContentType,
    } = env;

    if (!vcUrl || !vcKey) {
      console.log("No weather API url or key.");
      process.exit(1);
    }

    const url = prepareUrl({
      vcUrl,
      vcUnitGroup,
      vcKey,
      vcInclude,
      vcContentType,
    });

    try {
      const currentTimestamp = new Date().getTime();

      const response: AxiosResponse = await axios.get(url);
      const data: WeatherResponseData = response.data;
      data.days.forEach(async (day) => {
        const record: DayRecord | null = await db.oneOrNone(
          "SELECT id from day_weather WHERE date=$1 AND address=$2 AND lat=$3 AND lng=$4",
          [day.datetime, data.address, data.latitude, data.longitude]
        );
        if (record) {
          db.none(
            "UPDATE day_weather SET date=$1, lat=$2, lng=$3, address=$4, temp_max=$5, temp_min=$6, temp=$7, updated_at=current_timestamp WHERE id=$8",
            [
              day.datetime,
              data.latitude,
              data.longitude,
              data.address,
              day.tempmax,
              day.tempmin,
              day.temp,
              record.id,
            ]
          );
        } else {
          db.none(
            "INSERT INTO day_weather(date, lat, lng, address, temp_max, temp_min, temp, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, current_timestamp, current_timestamp)",
            [
              day.datetime,
              data.latitude,
              data.longitude,
              data.address,
              day.tempmax,
              day.tempmin,
              day.temp,
            ]
          );
        }
      });
      console.log("Weather data loaded.");
    } catch (e) {
      console.log("Failed to fetch API data. Error: ", (e as Error).message);
    }
  });
};
