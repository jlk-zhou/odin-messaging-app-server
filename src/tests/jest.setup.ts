import matchers from "jest-extended";
import { prisma } from "../lib/prisma.ts";
import { pool } from "../lib/prisma.ts";
import { auth } from "./testAuth.ts";
import { expect } from "@jest/globals";

expect.extend(matchers);

const ctx = await auth.$context;
export const test = ctx.test;

afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.$disconnect();
  await pool.end();
});
