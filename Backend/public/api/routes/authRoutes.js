"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// Authentication routes
router.post('/login', authController_1.loginHandler);
router.post('/register', authController_1.register);
router.post('/reset-password', authController_1.resetPassword);
exports.default = router;
