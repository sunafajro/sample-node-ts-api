import pgLib from "pg-promise";
import { connectDb } from "../connection";

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
  return await db.any("SELECT * FROM day_weather LIMIT ${limit} OFFSET ${offset}", {
    limit,
    offset,
  });
};

export const getDayWeather = async ({
  date,
}: DayWeatherRequestData): Promise<DayWeather | null> => {
  return await db.oneOrNone("SELECT * FROM day_weather WHERE date=${date}", {date});
};
