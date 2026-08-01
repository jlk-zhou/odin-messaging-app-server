import { body, validationResult } from "express-validator";
import { prisma } from "../../../lib/prisma.ts";
import type { Request, Response, NextFunction } from "express";

const emailFormatError = "must be of correct format.";
const emptyError = "must not be empty.";
const inUseError = "already in use.";
const maxLengthError = (max: number) =>
  `'s length must not exceed ${max} characters.`;
const minLengthError = (min: number) =>
  `'s length must be at least ${min} characters.`;
const noLowerCaseError = "must contain at least one lower case letter.";
const noMatchError = "does not match.";
const noNumberError = "must contain at least one number.";
const noUpperCaseError = "must contain at least one upper case letter.";

const user = [
  body("username")
    .notEmpty()
    .withMessage(`Username ${emptyError}`)
    .trim()
    .escape()
    .isLength({ max: 30 })
    .withMessage(`Username ${maxLengthError(30)}`)
    .custom(async (value) => {
      const user = await prisma.user.findUnique({
        where: { username: value },
      });
      if (user) {
        throw new Error(`Username ${inUseError}`);
      }
    }),

  body("firstName")
    .notEmpty()
    .withMessage(`FirstName ${emptyError}`)
    .trim()
    .escape()
    .isLength({ max: 10 })
    .withMessage(`FirstName ${maxLengthError(10)}`),

  body("lastName")
    .notEmpty()
    .withMessage(`LastName ${emptyError}`)
    .trim()
    .escape()
    .isLength({ max: 10 })
    .withMessage(`LastName ${maxLengthError(10)}`),

  body("email")
    .notEmpty()
    .withMessage(`Email ${emptyError}`)
    .trim()
    .escape()
    .isLength({ max: 30 })
    .withMessage(`Email ${maxLengthError(30)}`)
    .isEmail()
    .withMessage(`Email ${emailFormatError}`)
    .custom(async (value) => {
      const user = await prisma.user.findUnique({
        where: { email: value },
      });
      if (user) {
        throw new Error(`Email ${inUseError}`);
      }
    }),

  body("password")
    .notEmpty()
    .withMessage(`Password ${emptyError}`)
    .isLength({ max: 30 })
    .withMessage(`Password ${maxLengthError(30)}`)
    .isLength({ min: 8 })
    .withMessage(`Password ${minLengthError(8)}`)
    .matches(/[a-z]/)
    .withMessage(`Password ${noLowerCaseError}`)
    .matches(/[A-Z]/)
    .withMessage(`Password ${noUpperCaseError}`)
    .matches(/[0-9]/)
    .withMessage(`Password ${noNumberError}`),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Password must be confirmed.")
    .isLength({ max: 30 })
    .withMessage(`Password confirmation ${maxLengthError(30)}`)
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage(`Password ${noMatchError}`),
];

export const validateUser = [
  ...user,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
