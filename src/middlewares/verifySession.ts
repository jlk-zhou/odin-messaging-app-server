import { type NextFunction, type Request, type Response } from "express";
import { auth } from "../lib/auth.ts";
import { fromNodeHeaders } from "better-auth/node";
import { UnauthorizedError } from "../errors/httpErrors.ts";
import type { ParamsDictionary } from "../../global.js";

export default async function verifySession(
  req: Request<ParamsDictionary>,
  res: Response,
  next: NextFunction,
) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (!session) {
    return next(new UnauthorizedError("Please log in."));
  }
  res.locals.currentUser = session;
  next();
}
