import matchers from "jest-extended";
import { prisma } from "../lib/prisma.ts";
import { pool } from "../lib/prisma.ts";
import { expect, beforeEach, afterAll } from "@jest/globals"; 

expect.extend(matchers);

beforeEach(async () => {
  await prisma.$transaction([
    prisma.user.deleteMany(), 
    prisma.message.deleteMany(), 
  ]); 
})

afterAll(async () => {
  await prisma.$disconnect(); 
  await pool.end(); 
})