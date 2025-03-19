"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentValidator = void 0;
const express_validator_1 = require("express-validator");
const update = [
    (0, express_validator_1.body)("title")
        .optional()
        .isLength({ min: 0, max: 25 })
        .withMessage("Title must be between 0 and 25 characters."),
    (0, express_validator_1.body)("isPublic")
        .optional()
        .isBoolean()
        .withMessage("Must provide true or false value"),
];
exports.documentValidator = {
    update,
};
