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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardDataHandler = void 0;
const companyService_1 = require("../services/companyService");
const prisma_1 = require("../../lib/prisma");
const redis_1 = require("../utils/redis");
const logger_1 = require("../utils/logger");
const getDashboardDataHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        // Fetch company
        const company = yield (0, companyService_1.getCompanyByUserId)(userId);
        if (!company) {
            res.status(404).json({ message: 'Company not found' });
            return;
        }
        // Fetch ledgers and vouchers with caching
        const ledgersCacheKey = `ledgers:${company.id}`;
        const vouchersCacheKey = `vouchers:${company.id}`;
        let ledgers = yield redis_1.redisClient.get(ledgersCacheKey);
        let vouchers = yield redis_1.redisClient.get(vouchersCacheKey);
        if (!ledgers) {
            ledgers = JSON.stringify(yield prisma_1.prisma.ledger.findMany({ where: { companyId: company.id } }));
            yield redis_1.redisClient.set(ledgersCacheKey, ledgers, { EX: 3600 });
        }
        if (!vouchers) {
            vouchers = JSON.stringify(yield prisma_1.prisma.voucher.findMany({ where: { companyId: company.id } }));
            yield redis_1.redisClient.set(vouchersCacheKey, vouchers, { EX: 3600 });
        }
        res.status(200).json({
            companyInfo: company,
            ledgers: JSON.parse(ledgers),
            vouchers: JSON.parse(vouchers),
        });
    }
    catch (error) {
        logger_1.logger.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getDashboardDataHandler = getDashboardDataHandler;
