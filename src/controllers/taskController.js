const { StatusCodes } = require("http-status-codes");
const { errorWrapper } = require('../middleware/errorHandler');
const { ObjectId } = require('mongodb')
const taskServices = require('../services/taskServices')
const logger = require('../utils/logger')

const addTask = errorWrapper(async (req, res) => {
    const { task, description, status } = req.body;
    const token = req.user.id;
    logger.info(`${req.reqId} user tried to create a task`)
    const { data, error } = await taskServices.createTask(token, task, description, status, req.reqId);
    if (error) {
        logger.error(`${req.reqId} task is not created`)
        throw new ErrorHandler(error.StatusCodes, error.errorCode, error.Message);
    }
    logger.info(`${req.reqId} task created successfully`)
    return res.status(StatusCodes.CREATED).json({
        data: data,
        error: null
    })
})

const getUserTasks = errorWrapper(async (req, res) => {
    const token = req.user.id;
    const {task, status} = req.query;
    let page=Number(req.query.page) || 1;
    let limit=Number(req.query.limit) || 3;
    logger.info(`${req.reqId} user tried to fetch tasks`)
    const { data, error } = await taskServices.getTask({ token, task, status, page, limit })
    if (error) {
        logger.error(`${req.reqId} failed to fetch the task`)
        throw new ErrorHandler(error.StatusCodes, error.errorCode, error.Message);
    }
    logger.info(`${req.reqId} task fetched successfully`)
    return res.status(StatusCodes.OK).json({
        data: data,
        error: null
    })
})

const updateTask = errorWrapper(async (req, res) => {
    const { taskId } = req.params;
    const token = req.user.id;
    const { status } = req.body;
    logger.info(`${req.reqId} user tried to update tasks`)
    const { data, error } = await taskServices.updateTaskService(taskId, status, token);
    if (error) {
        logger.error(`${req.reqId} failed to update the task`)
        throw new ErrorHandler(error.StatusCodes, error.errorCode, error.Message);
    }
    logger.info(`${req.reqId} task updated successfully`)
    return res.status(StatusCodes.OK).json({
        data: data,
        error: null
    })
})

const deleteTask = errorWrapper(async (req, res) => {
    const { taskId } = req.params;
    const id= new ObjectId(taskId)
    const token = req.user.id;
    logger.info(`${req.reqId} user tried to delete tasks`)
    const { data, error } = await taskServices.deleteTaskService(id, token, req.reqId);
    if (error) {
        logger.error(`${req.reqId} failed to delete the task`)
        throw new ErrorHandler(error.StatusCodes, error.errorCode, error.Message);
    }
    logger.info(`${req.reqId} task deleted successfully`)
    return res.status(StatusCodes.OK).json({
        data: data,
        error: null
    })
})

const getAllTask = errorWrapper(async (req,res)=>{
    const {username,email, status, task}=req.query
    let page=Number(req.query.page) || 1;
    let limit=Number(req.query.limit) || 3;
    logger.info(`${req.reqId} user tried to fetch tasks`)
    const { data, error } = await taskServices.getAllTask({  username,email, status, task, page, limit })
    if (error) {
        logger.error(`${req.reqId} failed to fetch the task`)
        throw new ErrorHandler(error.StatusCodes, error.errorCode, error.Message);
    }
    logger.info(`${req.reqId} task fetched successfully`)
    return res.status(StatusCodes.OK).json({
        data: data,
        error: null
    })

})

const hardDeleteTask = errorWrapper(async (req,res)=>{
    const reqId= req.reqId;
    const batchSize = parseInt(req.query.batchSize) || 10;
    const delay = parseInt(req.query.delay) || 10000;
    logger.info(`${reqId} hard deletion started`);
    const { data, error } = await taskServices.hardDeleteService(reqId, delay, batchSize );

    return res.status(StatusCodes.OK).json({
        data: data,
        error: null
    })
})
module.exports = {
    addTask,
    getUserTasks,
    updateTask,
    deleteTask,
    getAllTask,
    hardDeleteTask
};
