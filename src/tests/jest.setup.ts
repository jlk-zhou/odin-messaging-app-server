import matchers from "jest-extended";
import { prisma } from "../lib/prisma.ts";
import { pool } from "../lib/prisma.ts";
import { expect, beforeEach, afterAll } from "@jest/globals";
import bcrypt from "bcryptjs";

expect.extend(matchers);

afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.$disconnect();
  await pool.end();
});
