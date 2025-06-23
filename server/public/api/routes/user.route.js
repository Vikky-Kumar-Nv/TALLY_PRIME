"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user = (0, express_1.Router)();
// 🔑 Authentication routes
user.post("/create", controllers_1.UserController.createUser); //🔓
user.get("/login", controllers_1.UserController.login); //🔐
user.get("/logout", controllers_1.UserController.logout); //🚪
// 🛡️ Apply authentication and admin role middleware for protected routes
user.use(auth_middleware_1.authenticate, auth_middleware_1.isAdmin);
exports.default = user;
