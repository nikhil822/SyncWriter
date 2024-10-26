import { body } from "express-validator";
import { userService } from "../services/user.service";

const registerValidator = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Must provide email address"),
  body("email").custom(async (value) => {
    const user = await userService.findUserByEmail(value);
    if (user) {
      return Promise.reject("User with this email already exists.");
    }
    return true;
  }),
  body("password1")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters"),
  body("password1")
    .matches(/\d/)
    .withMessage("Password must contain at least one digit."),
  body("password2").custom((value, { req }) => {
    if (value !== req.body.password1) {
      throw new Error("Passwords must match.");
    }
    return true;
  }),
];

const resetPasswordValidator = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Must provide a valid email address"),
];

const confirmResetPasswordValidator = [
  
]

export const userValidator = {
  register: registerValidator,
  resetPassword: resetPasswordValidator,
  //   confirmResetPassword: confirmResetPasswordValidator,
};
