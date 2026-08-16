import { NotFoundError } from "../../errors/httpErrors.ts";
import { prisma } from "../../lib/prisma.ts";
import { type NextFunction, type Request, type Response } from "express";

interface GetUserParams {
  username: string;
}

export async function getUser(
  req: Request<GetUserParams>,
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
