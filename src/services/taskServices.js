const { ErrorHandler } = require('../middleware/errorHandler');
const { StatusCodes } = require('http-status-codes')
const taskModel = require('../models/task');
const logger = require('../utils/logger');

async function createTask(token, task, description, status, reqId) {
    const result = await taskModel.createTask(token, task, description, status);
    if (!result.insertedId) {
        logger.error(`${reqId} failed to register task`)
        throw new ErrorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "DMS-VE0", "failed to register task")
    }
    return {
        data: {
            message: "task created successfully"
        },
        error: null
    }
}

async function getTask({ token, task, status, page, limit }) {
    
    const { tasks, user } = await taskModel.getTasksByUser({ token, task, status, page, limit });
    if (!user || !tasks) {
        logger.error(`${reqId} failed to fetch task`)
        throw new ErrorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "DMS-VE1", "failed to fetch task")
    }
    return {
        data: {
            tasks,
            user,
            message: "task fetched successfully"
        },
        error: null
    }
}

async function updateTaskService(taskId, status, token) {
    const value = await taskModel.getTaskById(taskId);
    console.log("value",value);
    if (!value || value.length===0) {
        logger.error(`${reqId} failed to fetch the task with the given taskID`)
        throw new ErrorHandler(StatusCodes.NOT_FOUND, "DMS-VE2", "didn't find the task")
    }
    const result = await taskModel.updateTaskStatus(taskId, status, token);
    if (!result) {
        logger.error(`${reqId} failed to update task`)
        throw new ErrorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "DMS-VE3", "failed to update task")
    }
    return {
        data: {
            result: status,
            message: `task wtih taskId ${taskId} updated successfully`
        },
        error: null
    }
}

async function deleteTaskService(taskId, token, reqId) {
    const value = await taskModel.getTaskById(taskId, token);
    if (!value) {
        logger.error(`${reqId} failed to delete task`)
        throw new ErrorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "DMS-VE4", "failed to delete task")
    }
    await taskModel.deleteTask(taskId);
    return {
        data: {
            message: `task wtih taskId ${taskId} deleted successfully`
        },
        error: null
    }
}

async function getAllTask({  username,email, status, task, page, limit }){
    
    const tasks = await taskModel.getAllTasks({  username,email, status, task, page, limit });
    if (!tasks) {
        logger.error(`${reqId} failed to fetch task`)
        throw new ErrorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "DMS-VE1", "failed to fetch task")
    }
    return {
        data: {
            tasks,
            message: "task fetched successfully"
        },
        error: null
    }
}
 async function hardDeleteService(reqId, delay, batchSize){
    await taskModel.hardDelete(delay, batchSize);
    logger.info(`${reqId} hard deletion successful`);
    return {
        data:{
            message: "hard deletion successful"
        },
        error: null
    }
 }

module.exports = {
    createTask,
    getTask,
    getAllTask,
    updateTaskService,
    deleteTaskService,
    hardDeleteService
};