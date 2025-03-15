const { StatusCodes } = require("http-status-codes");
require('dotenv').config()
const jwt = require('jsonwebtoken')
// const dbconnection = require("../config/db")
const { errorWrapper, ErrorHandler } = require('../middleware/errorHandler');
const logger = require("../utils/logger");

const tokenAuthenticate = errorWrapper(async (req, res, next) => {
    const token = req.headers["authorization"];
    logger.info('trying to fetch the token')
    if (!token) {
        logger.error('token not found')
        throw new ErrorHandler(StatusCodes.NOT_FOUND, "DMS_VE0", "Token not found");
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        logger.info("token fetched successfully")
        next();
    }
    catch (error) {
        logger.error('invalid token')
        throw new ErrorHandler(StatusCodes.BAD_REQUEST, "DMS_VE1", 'invalid Token')
    }
})

module.exports = tokenAuthenticate;