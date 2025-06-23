"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const dashboardController_1 = require("../controllers/dashboardController");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.authMiddleware, (0, authMiddleware_1.roleMiddleware)(['ADMIN', 'USER']), dashboardController_1.getDashboardDataHandler);
exports.default = router;
