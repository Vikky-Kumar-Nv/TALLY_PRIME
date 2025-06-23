"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = exports.createCompanySchema = void 0;
const zod_1 = require("zod");
exports.createCompanySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Company name is required'),
    financialYear: zod_1.z.string().min(1, 'Financial year is required'),
    booksBeginningYear: zod_1.z.string().min(1, 'Books beginning year is required'),
    address: zod_1.z.string().optional(),
    pin: zod_1.z.string().optional(),
    phoneNumber: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    panNumber: zod_1.z.string().optional(),
    gstNumber: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
});
exports.userSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters long').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    role: zod_1.z.enum(['USER', 'ADMIN']).optional().default('USER'),
});
