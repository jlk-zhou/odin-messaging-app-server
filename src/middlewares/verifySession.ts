import { type NextFunction, type Request, type Response } from "express";
import { auth } from "../lib/auth.ts";
import { fromNodeHeaders } from "better-auth/node";
import { UnauthorizedError } from "../errors/httpErrors.ts";
import type { ParamsDictionary } from "../../global.js";

// Verifies whether user is logged in
export default async function verifySession(
  req: Request<ParamsDictionary>,
  res: Response,
  next: NextFunction,
) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  // No session means not logged in, return 401
  if (!session) {
    return next(new UnauthorizedError("Please log in."));
  }

  // Otherwise, attach the user session as local variable and move on
  res.locals.currentUser = session;
  next();
}
