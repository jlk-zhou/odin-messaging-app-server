import { createAuthMiddleware, APIError } from "better-auth/api";
import * as z from "zod";
import * as _ from "lodash-es";

const emailFormatError = "must be of correct format.";
const escape = (s: string) => {
  return _.escape(s);
};
const emptyError = "must not be empty.";
const maxLengthError = (max: number) =>
  `'s length must not exceed ${max} characters.`;
const minLengthError = (min: number) =>
  `must have more than ${min} characters.`;
const noLowerCaseError = "must contain at least one lower case letter.";
const noNumberError = "must contain at least one number.";
const noUpperCaseError = "must contain at least one upper case letter.";
const stringError = "must be a string.";
const urlError = "must be a URL.";

const User = z.object({
  body: z.object({
    name: z
      .string(`Name ${stringError}`)
      .min(1, `Name ${emptyError}`)
      .max(30, `Name ${maxLengthError(50)}`)
      .trim()
      .transform(escape),
    username: z
      .string(`Username ${stringError}`)
      .min(1, `Username ${emptyError}`)
      .max(50, `Username ${maxLengthError(50)}`)
      .trim()
      .transform(escape),
    email: z
      .email(`Email ${emailFormatError}`)
      .min(1, `Email ${emptyError}`)
      .max(50, `Email ${maxLengthError(50)}`)
      .trim()
      .transform(escape),
    password: z
      .string(`Password ${stringError}`)
      .regex(/[a-z]/, `Password ${noLowerCaseError}`)
      .regex(/[A-Z]/, `Password ${noUpperCaseError}`)
      .regex(/[0-9]/, `Password ${noNumberError}`)
      .transform(escape),
  }),
});

const UpdateUser = z.object({
  body: z
    .object({
      name: z
        .string(`Name ${stringError}`)
        .min(1, `Name ${emptyError}`)
        .max(30, `Name ${maxLengthError(50)}`)
        .trim()
        .transform(escape),
      image: z
        .url(`Image ${urlError}`)
        .min(5, `Image ${minLengthError(5)}`)
        .max(50, `Image ${maxLengthError(50)}`)
        .trim()
        .transform(escape),
      bio: z
        .string(`Bio ${stringError}`)
        .min(1, `Bio ${emptyError}`)
        .max(300, `Bio ${maxLengthError(300)}`)
        .trim()
        .transform(escape),
      username: z
        .string(`Username ${stringError}`)
        .min(1, `Username ${emptyError}`)
        .max(50, `Username ${maxLengthError(50)}`)
        .trim()
        .transform(escape),
      displayUsername: z
        .string(`Display username ${stringError}`)
        .min(1, `Display username ${emptyError}`)
        .max(50, `Display username ${maxLengthError(50)}`)
        .trim()
        .transform(escape),
    })
    .partial(),
});

const ChangeEmail = z.object({
  body: z.object({
    newEmail: z
      .email(`Email ${emailFormatError}`)
      .min(1, `Email ${emptyError}`)
      .max(50, `Email ${maxLengthError(50)}`)
      .trim()
      .transform(escape),
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
      return { context: { ...ctx, body: { ...result.data.body } } };
    }
  } else if (ctx.path === "/update-user") {
    const result = UpdateUser.safeParse({ body: ctx.body });
    if (!result.success) {
      throw new APIError("BAD_REQUEST", {
        message: `${JSON.stringify(result.error.issues)}`,
      });
    } else {
      return { context: { ...ctx, body: { ...result.data.body } } };
    }
  } else if (ctx.path === "/change-email") {
    const result = ChangeEmail.safeParse({ body: ctx.body });
    if (!result.success) {
      throw new APIError("BAD_REQUEST", {
        message: `${JSON.stringify(result.error.issues)}`,
      });
    } else {
      return { context: { ...ctx, body: { ...result.data.body } } };
    }
  }
});
