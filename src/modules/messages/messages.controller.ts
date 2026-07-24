import { prisma } from "../../lib/prisma.ts";
import { type Request, type Response } from "express";
import type { GetMessageParams } from "../../types.d.ts";

export async function getAllMessages(req: Request, res: Response) {
  const message = await prisma.message.findMany();
  return res.send(message);
}

export async function getMessage(req: Request<GetMessageParams>, res: Response) {
  const message = await prisma.message.findUnique({
    where: { id: req.params.messageId },
  });
  return res.send(message);
}
