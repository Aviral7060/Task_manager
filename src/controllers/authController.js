const { StatusCodes } = require("http-status-codes");
const authServices = require('../services/authServices');
const { errorWrapper, ErrorHandler } = require('../middleware/errorHandler');
const logger = require("../utils/logger");

const signUp = errorWrapper(async (req, res) => {  //registerUser
    const { name, email, mobileNo, username, password, role } = req.body;
    logger.info(`${req.reqId} user tried to register`); //log req.body
    const { data, error } = await authServices.registerUser(name, email, mobileNo, username, password, req.reqId, role);
    if (error) {
        logger.error(`${req.reqId} there is some error in registration`)
        throw new ErrorHandler(error.StatusCodes, error.errorCode, error.Message);
    }
    logger.info(`${req.reqId} user registration is successful`)
    return res.status(StatusCodes.CREATED).json({
        data: data,
        error: null
    })
})

const loginUser = errorWrapper(async (req, res) => {
    const { username, password } = req.body;
    logger.info(`${req.reqId} user tried to login`) //remove reqId 
    const { data, error } = await authServices.logIn(username, password,req.reqId);
    if (error) {
        logger.error(`${req.reqId} there is some error in login`)
        throw new ErrorHandler(error.StatusCodes, error.errorCode, error.Message);
    }
    logger.info(`${req.reqId} user login is successful`)
    return res.status(StatusCodes.OK).json({
        data: data,
        error: null
    })
})

module.exports = {
    signUp,
    loginUser
};