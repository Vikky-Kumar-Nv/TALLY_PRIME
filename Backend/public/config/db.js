"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const logger_1 = require("../api/utils/logger");
// Initialize Prisma Client
const prisma = new client_1.PrismaClient({
    log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
    ],
});
// Log database queries and errors
prisma.$on('query', (e) => {
    logger_1.logger.info('Query: ' + e.query);
    logger_1.logger.info('Params: ' + e.params);
    logger_1.logger.info('Duration: ' + e.duration + 'ms');
});
prisma.$on('error', (e) => {
    logger_1.logger.error('Prisma Error: ' + e.message);
});
prisma.$on('info', (e) => {
    logger_1.logger.info('Prisma Info: ' + e.message);
});
exports.default = prisma;
