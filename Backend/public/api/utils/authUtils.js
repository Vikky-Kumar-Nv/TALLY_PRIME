"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = exports.verifyPassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '1h'; // Setting to 1 hour for security
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashed = yield bcryptjs_1.default.hash(password, salt);
        return hashed;
    }
    catch (error) {
        throw new Error(`Error hashing password: ${error}`);
    }
});
exports.hashPassword = hashPassword;
const verifyPassword = (plainPassword, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return bcryptjs_1.default.compare(plainPassword, hashedPassword);
});
exports.verifyPassword = verifyPassword;
const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyToken = verifyToken;
