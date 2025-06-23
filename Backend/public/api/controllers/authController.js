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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.register = exports.loginHandler = void 0;
const logger_1 = require("../utils/logger");
const prisma_1 = require("../../lib/prisma");
const authUtils_1 = require("../utils/authUtils");
const bcrypt = __importStar(require("bcryptjs"));
const companyValidator_1 = require("../validators/companyValidator");
// Login handler - supports both login and automatic registration
const loginHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            logger_1.logger.warn('Missing username or password');
            res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
            return;
        }
        logger_1.logger.info(`Login attempt for username: ${username}`);
        // Try to find the user
        let user = yield prisma_1.prisma.user.findUnique({
            where: { email: username }
        });
        if (!user) {
            logger_1.logger.info(`User ${username} not found, creating new user`);
            user = yield prisma_1.prisma.user.create({
                data: {
                    email: username,
                    password,
                    role: 'USER'
                }
            });
            logger_1.logger.info(`New user created with ID: ${user.id}`);
        }
        else {
            // For existing users, verify password
            const isValidPassword = yield bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                logger_1.logger.warn(`Invalid password attempt for user: ${username}`);
                res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
                return;
            }
            logger_1.logger.info(`Password verified for user: ${username}`);
        }
        // Generate JWT token
        const token = (0, authUtils_1.generateToken)(user);
        // Prepare user response object (without sensitive data)
        const userResponse = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        logger_1.logger.info(`Login successful for user: ${username}`);
        res.status(200).json({
            success: true,
            token,
            user: userResponse
        });
    }
    catch (error) {
        logger_1.logger.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.loginHandler = loginHandler;
// Register new user
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info('Register request received', req.body);
        // Validate input
        const validatedData = companyValidator_1.userSchema.parse(req.body);
        const { email, password, role } = validatedData;
        // Check if user already exists
        const existingUser = yield prisma_1.prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            logger_1.logger.warn(`User already exists: ${email}`);
            res.status(400).json({
                success: false,
                message: 'User already exists'
            });
            return;
        }
        // Create new user - password will be hashed by Prisma middleware
        const user = yield prisma_1.prisma.user.create({
            data: {
                email,
                password, // Plain password, Prisma middleware hashes it
                role
            }
        });
        logger_1.logger.info(`User created: ${email}, ID: ${user.id}`);
        // Generate JWT token
        const token = (0, authUtils_1.generateToken)(user);
        logger_1.logger.info(`Generated token for user ${email}`);
        // Remove password from response
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        res.status(201).json({
            success: true,
            data: {
                user: userWithoutPassword,
                token
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Error in register controller:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
});
exports.register = register;
// Reset password
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, oldPassword, newPassword } = req.body;
        logger_1.logger.info(`Reset password request for user ${email}`);
        // Validate new password
        const validatedData = companyValidator_1.userSchema.shape.password.parse(newPassword);
        // Find user
        const user = yield prisma_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            logger_1.logger.warn(`User not found: ${email}`);
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        // Verify old password
        logger_1.logger.info(`Verifying old password for user ${email}`);
        const isValidPassword = yield bcrypt.compare(oldPassword, user.password);
        if (!isValidPassword) {
            logger_1.logger.warn(`Invalid old password for user ${email}`);
            res.status(401).json({
                success: false,
                message: 'Invalid old password'
            });
            return;
        }
        // Update password - new password will be hashed by Prisma middleware
        yield prisma_1.prisma.user.update({
            where: { id: user.id },
            data: { password: validatedData }
        });
        logger_1.logger.info(`Password updated for user ${email}`);
        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    }
    catch (error) {
        logger_1.logger.error('Error in resetPassword controller:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
});
exports.resetPassword = resetPassword;
