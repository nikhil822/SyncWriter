import { body } from "express-validator";

const update = [
  body("title")
    .optional()
    .isLength({ min: 0, max: 25 })
    .withMessage("Title must be between 0 and 25 characters."),
  body("isPublic")
    .optional()
    .isBoolean()
    .withMessage("Must provide true or false value"),
];

export const documentValidator = {
  update,
};
