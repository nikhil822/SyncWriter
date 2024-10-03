import { body } from "express-validator";

const emailValidator = () =>
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Must provide a valid email address");

const passwordValidator = () =>
  body("password").exists().withMessage("Must provide a password");

const tokenValidator = () =>
  body("token").exists().withMessage("Must provide a valid token.");


export const loginValidator = [emailValidator(), passwordValidator()];

export const refreshTokenValidator = [tokenValidator()];
