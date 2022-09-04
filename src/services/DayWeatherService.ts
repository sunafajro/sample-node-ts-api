import pgLib from "pg-promise";
import { connectDb } from "../connection";
import { sql } from "../helpers/SqlFileHelper";

const db: pgLib.IDatabase<{}, any> = connectDb();

export interface DayWeather {
  id: number;
  date: Date;
  lat: number;
  lng: number;
  address: string;
  temp_max: number;
  temp_min: number;
  temp: number;
  created_at: Date;
  updated_at: Date;
}

interface DaysWeatherRequestData {
  limit: number;
  offset: number;
}

interface DayWeatherRequestData {
  date: string;
}

export const getDaysWeather = async ({
  limit,
  offset,
}: DaysWeatherRequestData): Promise<DayWeather[]> => {
  const sqlSelectDaysWeather = sql("./sql/selectDaysWeather.sql");
  return await db.any(sqlSelectDaysWeather, {
    limit,
    offset,
  });
};

export const getDayWeather = async ({
  date,
}: DayWeatherRequestData): Promise<DayWeather | null> => {
  const sqlSelectDayWeather = sql("./sql/selectDayWeather.sql");
  return await db.oneOrNone(sqlSelectDayWeather, {
    date,
  });
};
