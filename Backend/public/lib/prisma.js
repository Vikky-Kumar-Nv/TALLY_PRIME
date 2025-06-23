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
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const logger_1 = require("../api/utils/logger");
const prisma = new client_1.PrismaClient({
    log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
    ],
});
exports.prisma = prisma;
// Log database queries and errors
prisma.$on('query', (e) => {
    logger_1.logger.info('Query: ' + e.query);
    logger_1.logger.info('Params: ' + e.params);
    logger_1.logger.info('Duration: ' + e.duration + 'ms');
});
prisma.$on('error', (e) => {
    logger_1.logger.error('Database error: ' + e.message);
});
// Password hashing middleware
prisma.$use((params, next) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info(`Prisma middleware triggered for model: ${params.model}, action: ${params.action}`);
    // Only run this middleware for create/update operations on User model
    if (params.model === 'User' &&
        (params.action === 'create' || params.action === 'update' || params.action === 'upsert')) {
        logger_1.logger.info(`Processing password for ${params.action} on User model`);
        try {
            if (params.args.data.password) {
                const salt = yield bcrypt.genSalt(10);
                const plainPassword = params.args.data.password;
                params.args.data.password = yield bcrypt.hash(plainPassword, salt);
                logger_1.logger.info('Password successfully hashed');
            }
        }
        catch (error) {
            logger_1.logger.error('Error hashing password:', error);
            throw error;
        }
    }
    return next(params);
}));
