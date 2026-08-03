import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma.ts";
import type { ParamsDictionary } from "../../../global.js";

export async function getChats(req: Request<ParamsDictionary>, res: Response) {
  const user = res.locals.currentUser;
  return res.json(user);
}
