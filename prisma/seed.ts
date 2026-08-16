import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";
import { auth } from "../src/lib/auth.ts";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function main() {
  const alice = auth.api.signUpEmail({
    body: {
      name: "Alice",
      email: "alice@example.com",
      username: "alice",
      password: "SecurePassword123",
    },
  });
  // const bob = await prisma.user.upsert({
  //   where: { username: "bob" },
  //   update: {},
  //   create: {
  //     id: "2",
  //     name: "Bob",
  //     email: "Bob@example.com",
  //     username: "bob",
  //     password: "Qwe123456",
  //   },
  // });
  // const carmen = await prisma.user.upsert({
  //   where: { username: "carmen" },
  //   update: {},
  //   create: {
  //     id: "3",
  //     name: "Carmen",
  //     email: "carmen@example.com",
  //     username: "carmen",
  //     password: "VerySecurePw2456",
  //   },
  // });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
