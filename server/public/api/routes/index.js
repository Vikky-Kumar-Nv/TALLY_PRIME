"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = exports.AdminRoute = void 0;
const admin_routes_1 = __importDefault(require("./admin.routes"));
exports.AdminRoute = admin_routes_1.default;
const user_route_1 = __importDefault(require("./user.route"));
exports.UserRoute = user_route_1.default;
