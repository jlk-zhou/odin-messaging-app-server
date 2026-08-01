import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

import bcrypt from "bcryptjs";

export async function main() {
  const alice = await prisma.user.upsert({
    where: { username: "alice" },
    update: {},
    create: {
      username: "alice",
      firstName: "Alice",
      lastName: "Chong",
      email: "alice@gmail.com",
      bio: "My parents dumped me so here I am",
      icon: "https://alice.icon.png",
      password: await bcrypt.hash("123456", 10),
    },
  });

  const bob = await prisma.user.upsert({
    where: { username: "bob" },
    update: {},
    create: {
      username: "bob",
      firstName: "Bob",
      lastName: "Chan",
      email: "bob@gmail.com",
      bio: "I'm a proud SWE",
      icon: "https://bob.icon.png",
      password: await bcrypt.hash("password", 10),
    },
  });
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
