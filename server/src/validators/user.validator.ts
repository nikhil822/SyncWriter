import { body } from "express-validator";
import { userService } from "../services/user.service";

const registerValidator = [
    body("email").isEmail().normalizeEmail().withMessage("Must provide email address"),
    body('email').custom(async (value) => {
        const user = await userService.findUserByEmail(value)
        if(user) {
            return Promise.reject("User with this email already exists.")
        }
        return true
    }),

]

export const userValidator = {
  register: registerValidator,
//   resetPassword: resetPasswordValidator,
//   confirmResetPassword: confirmResetPasswordValidator,
};