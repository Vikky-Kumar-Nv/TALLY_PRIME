"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error(err.message, { stack: err.stack });
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
};
exports.errorHandler = errorHandler;
