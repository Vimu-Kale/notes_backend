import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err?.stack ?? "Something went wrong!");
  res.status(500).json({ error: "Something went wrong!" });
};
