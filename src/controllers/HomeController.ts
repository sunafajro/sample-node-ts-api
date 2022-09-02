import express, { Request, Response, NextFunction } from "express";
import { home } from "../services/HomeService";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json(home());
});

export default router;
