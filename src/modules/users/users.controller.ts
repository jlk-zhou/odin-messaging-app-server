import bcrypt from "bcryptjs";
import { NotFoundError } from "../../errors/httpErrors.ts";
import { prisma } from "../../lib/prisma.ts";
import { type NextFunction, type Request, type Response } from "express";

interface GetUserParams {
  id: string;
}

export async function getUser(
  req: Request<GetUserParams>,
  res: Response,
  next: NextFunction,
) {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
  });

  if (!user) {
    return next(
      new NotFoundError(`Cannot find user with username '${req.params.id}'`),
    );
  }

  return res.json(user);
}

// export async function createUser(req: Request, res: Response) {
//   const user = await prisma.user.create({
//     data: {
//       username: req.body.username,
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       email: req.body.email,
//       password: await bcrypt.hash(req.body.password, 10),
//     },
//   });

//   const { password, ...userWithoutPassword } = user;
//   return res.json(userWithoutPassword);
// }
