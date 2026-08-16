import type { ParamsDictionary } from "../../../global.d.ts";
import { NotFoundError } from "../../errors/httpErrors.ts";
import { prisma } from "../../lib/prisma.ts";
import { type NextFunction, type Request, type Response } from "express";

export async function getUser(
  req: Request<ParamsDictionary>,
  res: Response,
  next: NextFunction,
) {
  const user = await prisma.user.findUnique({
    where: { username: req.params.username },
  });

  if (!user) {
    return next(
      new NotFoundError(
        `Cannot find user with username '${req.params.username}'`,
      ),
    );
  }

  return res.json(user);
}
