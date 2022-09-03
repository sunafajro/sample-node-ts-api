import express, { Request, Response, NextFunction } from "express";
import {
  DayWeather,
  getDaysWeather,
  getDayWeather,
} from "../services/DayWeatherService";
import { fromString } from "../helpers/NumberHelper";

const router = express.Router();

router.get(
  "/weather",
  async (req: Request, res: Response, next: NextFunction) => {
    const limit = fromString(req.params.limit, 10);
    const offset = fromString(req.params.offset, 0);
    const items: DayWeather[] = await getDaysWeather({ limit, offset });
    return res.status(200).json(items);
  }
);

router.get(
  "/weather/:date",
  async (req: Request, res: Response, next: NextFunction) => {
    const date = req.params.date;
    if (date.match(/\d{4}-\d{2}-\d{2}/)) {
      const item: DayWeather|null = await getDayWeather({ date: date });
      return res.status(200).json(item);
    }
    return res.status(200).json({});
  }
);

export default router;
