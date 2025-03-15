const { StatusCodes } = require("http-status-codes");
const { ErrorHandler } = require("./errorHandler");
const logger = require("../utils/logger");

// yeh file hataani hai


function validateRequest(schema) {

    return (req, res, next) => {
        const { error } = schema.validate({ ...req.body, ...req.params }, { abortEarly: false });
        if (error) {
            logger.error("validation error")
            next(new ErrorHandler(
                StatusCodes.BAD_REQUEST,
                "Validation_error",
                error.details.map((err) => err.message).join(" ,")
            ))
        }
        logger.info('validation successful');
        next();
    };
}

module.exports = validateRequest;