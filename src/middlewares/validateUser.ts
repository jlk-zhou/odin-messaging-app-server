import { createAuthMiddleware, APIError } from "better-auth/api";
import * as z from "zod";
import * as _ from "lodash";

const emailFormatError = "must be of correct format.";
const escape = (s: string) => _.escape(s);
const emptyError = "must not be empty.";
const maxLengthError = (max: number) =>
  `'s length must not exceed ${max} characters.`;
const noLowerCaseError = "must contain at least one lower case letter.";
const noNumberError = "must contain at least one number.";
const noUpperCaseError = "must contain at least one upper case letter.";

const User = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, `Name ${emptyError}`)
      .max(30, `Name ${maxLengthError}`)
      .trim()
      .transform(escape),
    email: z
      .email(`Email ${emailFormatError}`)
      .min(1, `Email ${emptyError}`)
      .max(50, `Email ${maxLengthError(50)}`)
      .trim()
      .transform(escape),
    password: z
      .string()
      .regex(/[a-z]/, `Password ${noLowerCaseError}`)
      .regex(/[A-Z]/, `Password ${noUpperCaseError}`)
      .regex(/[0-9]/, `Password ${noNumberError}`),
  }),
});

export const validateUser = createAuthMiddleware(async (ctx) => {
  if (ctx.path === "/sign-up/email") {
    const result = User.safeParse({
      body: ctx.body,
    });
    if (!result.success) {
      throw new APIError("BAD_REQUEST", {
        message: `${JSON.stringify(result.error.issues)}`,
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
});
