import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.ts";
import { validateUser } from "../middlewares/validateUser.ts";
import { username } from "better-auth/plugins";

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
  plugins: [
    username({
      minUsernameLength: 5,
      maxUsernameLength: 50,
    }),
  ],
  trustedOrigins: ["http://localhost:5173"],
});
