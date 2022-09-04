import express, { Request, Response, NextFunction } from "express";
import Prometheus from "prom-client";
import { createRegister } from "../prometheus";
import { home, health } from "../services/SiteService";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json(home());
});

router.get("/health", (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json(health());
});

router.get("/metrics", async (req: Request, res: Response, next: NextFunction) => {
  const register = createRegister();
  console.log(register);
  if (register) {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } else {
    return res.status(500).json({});
  }
});

export default router;
