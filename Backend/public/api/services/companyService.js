"use strict";
// import { PrismaClient } from '@prisma/client';
// import { CreateCompanyInput } from '../validators/companyValidator';
// import { redisClient } from '../utils/redis';
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
exports.getCompanyByUserId = exports.createCompany = void 0;
// const prisma = new PrismaClient();
// export const createCompany = async (input: CreateCompanyInput, userId: number) => {
// const company = await prisma.company.create({
// data: {
// ...input,
// userId,
// },
// });
// // Invalidate cache
// await redisClient.del(`company:${userId}`);
// return company;
// };
// export const getCompanyByUserId = async (userId: number) => {
// const cacheKey = `company:${userId}`;
// const cachedCompany = await redisClient.get(cacheKey);
// if (cachedCompany) {
// return JSON.parse(cachedCompany);
// }
// const company = await prisma.company.findFirst({
// where: { userId },
// });
// if (company) {
// await redisClient.set(cacheKey, JSON.stringify(company), { EX: 3600 }); // Cache for 1 hour
// }
// return company;
// };
const prisma_1 = require("../../lib/prisma");
const redis_1 = require("../utils/redis");
const createCompany = (input, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // First, make sure the user exists
    const user = yield prisma_1.prisma.user.findUnique({
        where: { id: userId }
    });
    if (!user) {
        throw new Error('User not found. Cannot create company without a valid user.');
    }
    const company = yield prisma_1.prisma.company.create({
        data: Object.assign(Object.assign({}, input), { userId }),
    });
    // Invalidate cache
    yield redis_1.redisClient.del(`company:${userId}`);
    return company;
});
exports.createCompany = createCompany;
const getCompanyByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const cacheKey = `company:${userId}`;
    const cachedCompany = yield redis_1.redisClient.get(cacheKey);
    if (cachedCompany) {
        return JSON.parse(cachedCompany);
    }
    const company = yield prisma_1.prisma.company.findFirst({
        where: { userId },
    });
    if (company) {
        yield redis_1.redisClient.set(cacheKey, JSON.stringify(company), { EX: 3600 }); // Cache for 1 hour
    }
    return company;
});
exports.getCompanyByUserId = getCompanyByUserId;
