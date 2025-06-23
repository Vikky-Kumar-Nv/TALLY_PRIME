"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = require("express-rate-limit");
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const error_Middleware_1 = __importDefault(require("./api/middlewares/error.Middleware"));
const routes_1 = require("./api/routes");
// 📦 Importing Routes
const routes_2 = require("./api/routes");
// 🚀 Initialize express application
const app = (0, express_1.default)();
// 🛡️ Security and utility middlewares
app.use(express_1.default.json());
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
// app.use(
//   cors({
//     origin: [ENV.FRONTEND_URL as string, ENV.FRONTEND_URL1 as string],
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//     credentials: true,
//   })
// );
app.use((0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, //⌛ 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        status: 429,
        message: "Too many requests, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
}));
// 🩺 Health check endpoint
app.get("/", (_, res) => {
    res.send("Hello World");
});
// 🧭 API routes configuration
app.use("/api/v1/admin", routes_2.AdminRoute);
app.use("/api/v1/user", routes_1.UserRoute);
// ⚠️ Global error handling middleware
app.use(error_Middleware_1.default);
// 📤 Export the configured app
exports.default = app;
