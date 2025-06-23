"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const companyController_1 = require("../controllers/companyController");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.authMiddleware, (0, authMiddleware_1.roleMiddleware)(['ADMIN', 'USER']), companyController_1.createCompanyHandler);
exports.default = router;
