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
exports.createCompanyHandler = void 0;
const companyValidator_1 = require("../validators/companyValidator");
const companyService_1 = require("../services/companyService");
const logger_1 = require("../utils/logger");
const createCompanyHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = companyValidator_1.createCompanySchema.parse(req.body);
        const userId = req.user.id;
        const company = yield (0, companyService_1.createCompany)(validatedData, userId);
        res.status(201).json(company);
    }
    catch (error) {
        logger_1.logger.error('Error creating company:', error);
        res.status(400).json({ message: error.message });
    }
});
exports.createCompanyHandler = createCompanyHandler;
