import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.ts";
import { Pool } from "pg";

const connectionString =
  process.env.NODE_ENV === "test"
    ? `${process.env.TEST_DATABASE_URL}`
    : `${process.env.DATABASE_URL}`;

export const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
