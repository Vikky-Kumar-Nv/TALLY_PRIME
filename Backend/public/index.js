"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const logger_1 = require("./api/utils/logger");
const companyRoutes_1 = __importDefault(require("./api/routes/companyRoutes"));
const dashboardRoutes_1 = __importDefault(require("./api/routes/dashboardRoutes"));
const authRoutes_1 = __importDefault(require("./api/routes/authRoutes"));
const errorHandler_1 = require("./api/middlewares/errorHandler");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, helmet_1.default)()); // Secure headers
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/companies', companyRoutes_1.default);
app.use('/api/dashboard', dashboardRoutes_1.default);
// Error handling
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger_1.logger.info(`Server running on http://localhost:${PORT}`);
});
exports.default = app;
