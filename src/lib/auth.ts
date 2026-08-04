import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.ts";
import { createAuthMiddleware, APIError } from "better-auth/api";
import * as z from "zod";
import { validateUser } from "../middlewares/validateUser.ts";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    maxPasswordLength: 32,
    minPasswordLength: 8,
  },
  hooks: {
    before: validateUser,
  },
  trustedOrigins: ["http://localhost:5173"],
});
