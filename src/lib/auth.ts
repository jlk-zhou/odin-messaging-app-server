import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.ts";
import { createAuthMiddleware, APIError } from "better-auth/api";
import * as z from "zod";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        // Validate user sign up input
        const User = z.object({
          body: z.object({
            name: z.string(),
            email: z.email(),
            password: z.string(),
          }),
        });
        const result = User.safeParse({
          body: ctx.body,
        });
        if (!result.success) {
          throw new APIError("BAD_REQUEST", {
            message: `Zod error, ${JSON.stringify(result.error.issues)}`,
          });
        } else {
          return {
            context: {
              ...ctx,
              body: {
                ...result.data.body,
              },
            },
          };
        }
      }
    }),
  },
  trustedOrigins: ["http://localhost:5173"],
});
