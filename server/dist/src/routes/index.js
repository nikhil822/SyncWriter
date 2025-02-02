"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("./user.route");
const auth_route_1 = require("./auth.route");
const router = (0, express_1.Router)();
router.use("/user", user_route_1.user);
router.use("/auth", auth_route_1.auth);
exports.default = router;
