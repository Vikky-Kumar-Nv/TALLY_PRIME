"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdminController = __importStar(require("../controllers/admin.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const admin = (0, express_1.Router)();
// 🔑 Authentication routes
admin.post("/login", AdminController.login); // 🔐 Handle admin login
admin.get("/logout", AdminController.logout); // 🚪 Handle admin logout
// 🛡️ Apply authentication and admin role middleware for protected routes
admin.use(auth_middleware_1.authenticate, auth_middleware_1.isAdmin);
// 👤 Admin management routes
admin.post("/create", AdminController.createAdmin); // 📝 Create new admin
admin.get("/all", AdminController.AllAdmins); // 📋 Get list of all admins
// 🔍 Admin specific operations using ID
admin
    .route("/:id")
    .get(AdminController.getAdminById) // 🔎 Get admin by ID
    .delete(AdminController.deleteById); // 🗑️ Delete admin
exports.default = admin;
