import { prisma } from "../../lib/prisma.ts";
import { type Request, type Response } from "express"; 
import type { GetUserParams } from "../../types.d.ts"; 

export async function getAllUsers(req: Request, res: Response) {
  const user = await prisma.user.findMany();
  return res.send(user);
}

export async function getUser(req: Request<GetUserParams>, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.params.userId },
  });
  return res.send(user); 
}
