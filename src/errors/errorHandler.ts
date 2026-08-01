import { type Request, type Response, type NextFunction } from "express";
import { HttpError } from "../errors/httpErrors.ts";

export default function (
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    return next(error);
  }

  if (!error.statusCode) {
    error.statusCode = 500;
  }

  if (process.env.NODE_ENV === "development") {
    console.error("Stack Trace:", error.stack);
  }

  return res.status(error.statusCode).json({ error: error.message });
}
