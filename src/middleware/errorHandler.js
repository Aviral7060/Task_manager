const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const logger = require("../utils/logger");


// Custom Error Handler Class
class ErrorHandler extends Error {
    constructor(statusCode = StatusCodes.INTERNAL_SERVER_ERROR, errorCode = "UNKNOWN_ERROR", errorMessage = "Something went wrong", stack) {
        super(errorMessage);
        this.statusCode = statusCode;
        this.result = {
            data: null,
            error: {
                errorCode,
                errorMessage
            }
        };
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Wrapper for Error Handling in Async Functions
const errorWrapper = (fnc) => async (req, res, next) => {
    try {
        await fnc(req, res, next);
    } catch (error) {
        next(error);
    }
};

// Global Error Handler Middleware
const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const result = err.result || {
        data: null,
        error: {
            errorCode: "INTERNAL_SERVER_ERROR",
            errorMessage: ReasonPhrases.INTERNAL_SERVER_ERROR
        }
    };

    res.status(statusCode).json({ result });
};

module.exports = {
    ErrorHandler,
    errorWrapper,
    globalErrorHandler
};
