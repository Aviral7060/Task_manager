const connectDB = require('../config/db');
const {collection,Levels}=require('../constant');
const client = require('../config/redis');
const { ErrorHandler,errorWrapper } = require('./errorHandler');
const { StatusCodes } = require('http-status-codes');
const logger = require("../utils/logger");

const collection3=collection.COLLECTION3;

async function checkAccessLevel (path)  {
    let level;
    level = await client.get(path);
    if(!level) {
        const db = await connectDB();
    
        const result = await db.collection(collection3).findOne(
            { path }, // Query filter
            { projection: { _id: 0, level: 1 } } // Correct way to apply projection in findOne()
        )
        level = Number(result.level);
        await client.setex(path, 10000, level)
    }
    return level;
}

const authorizeMiddleWare= errorWrapper(async (req,res,next)=>{
    logger.info("entered in the authorize middleware")
    const role=req.user.role;
    const roleLevel=Levels[role];
    const cleanedPath = req.baseUrl + req.route.path;
    const routeLevel=await checkAccessLevel(cleanedPath);
    if(roleLevel<=routeLevel) next();
    else throw new ErrorHandler(StatusCodes.BAD_REQUEST,"DMS_VE0","you are not authorized")
})

module.exports =  authorizeMiddleWare ;