import * as dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";
import pgLib from "pg-promise";
import { connectDb } from "../connection";
import { sql } from "../helpers/SqlFileHelper";

dotenv.config();

const db: pgLib.IDatabase<{}, any> = connectDb();

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

export const getDaysWeatherData = async () => {
  console.log("Getting weather data...");

  const {
    VC_URL: vcUrl,
    VC_KEY: vcKey,
    VC_UNIT_GROUP: vcUnitGroup,
    VC_INCLUDE: vcInclude,
    VC_CONTENT_TYPE: vcContentType,
  } = process.env;

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
    const response: AxiosResponse = await axios.get(url);
    const data: WeatherResponseData = response.data;
    const sqlSelectDayWeather = sql("./sql/scheduleSelectDayWeather.sql");
    const sqlInsertDayWeather = sql("./sql/scheduleInsertDayWeather.sql");
    const sqlUpdateDayWeather = sql("./sql/scheduleUpdateDayWeather.sql");
    data.days.forEach(async (day) => {
      const record: DayRecord | null = await db.oneOrNone(sqlSelectDayWeather, {
        date: day.datetime,
        address: data.address,
        lat: data.latitude,
        lng: data.longitude,
      });
      if (record) {
        db.none(sqlUpdateDayWeather, {
          tempMax: day.tempmax,
          tempMin: day.tempmin,
          temp: day.temp,
          id: record.id,
        });
      } else {
        db.none(sqlInsertDayWeather, {
          date: day.datetime,
          lat: data.latitude,
          lng: data.longitude,
          address: data.address,
          tempMax: day.tempmax,
          tempMin: day.tempmin,
          temp: day.temp,
        });
      }
    });
    console.log("Weather data loaded.");
  } catch (e) {
    console.log("Failed to fetch API data. Error: ", (e as Error).message);
  }
};
