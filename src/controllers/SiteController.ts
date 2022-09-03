import express, { Request, Response, NextFunction } from "express";
import { home, health } from "../services/SiteService";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json(home());
});

router.get("/health", (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json(health());
});

export default router;
