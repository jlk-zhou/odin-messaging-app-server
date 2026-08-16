import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../lib/prisma.ts";
import { validateUser } from "../middlewares/validateUser.ts";
import { username, testUtils } from "better-auth/plugins";

export const auth = betterAuth({
  // ... other config options
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
    testUtils(),
  ],
});
