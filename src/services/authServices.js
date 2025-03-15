const { StatusCodes } = require("http-status-codes");
// const { v4: uuidv4 } = require("uuid");
const bcrypt = require('bcryptjs');
const { ErrorHandler } = require("../middleware/errorHandler");
const User = require('../models/user');
const logger = require("../utils/logger");
const generateToken=require('../utils/authToken')

async function registerUser(name, email, mobileNo, username, password, reqId, role) { //obj 
    const existing = await User.findUserByUsername(username); //variable name
    if (existing) {
        logger.error(`${reqId} user already exists`)
        throw new ErrorHandler(StatusCodes.CONFLICT, "DMS-VE0", "User already exists") //BAD_REQUEST
    }
    // const userToken = uuidv4(); //bson objectID;
    const result = await User.createUser(name, email, mobileNo, username, password, role);
    if (!result.insertedId) {
        logger.error(`${reqId} user failed to register`)
        throw new ErrorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "DMS-VE1", "failed to register user")
    }
    return {
        data: {
            id: result.insertedId,
            message: "user registered successfully"
        },
        error: null
    };
}

async function logIn(username, password,reqId) {
    const user = await User.findUserByUsername(username);
    if (!user) {
        logger.error(`${reqId} User does not exists`) //remove reqId 
        throw new ErrorHandler(StatusCodes.NOT_FOUND, "DMS-VE2", "User doesnot exists")
    }
    else {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            logger.error(`${reqId} either username or password is wrong`) //remove reqId 
            throw new ErrorHandler(StatusCodes.UNAUTHORIZED, "DMS-VE3", "either username or password is wrong") //pick from constants
        }
        const token=generateToken(user);
        return {
            data: {
                userToken: token,
                message: "logged in successfully"
            }
        }
    }
}

module.exports = {
    registerUser,
    logIn
}