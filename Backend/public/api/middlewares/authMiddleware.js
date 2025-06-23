"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utils/logger");
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        logger_1.logger.error('Authentication error:', error);
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
        return;
    }
};
exports.authMiddleware = authMiddleware;
const roleMiddleware = (roles) => (req, res, next) => {
    const user = req.user;
    if (!roles.includes(user.role)) {
        res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        return;
    }
    next();
};
exports.roleMiddleware = roleMiddleware;
