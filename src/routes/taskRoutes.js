const express = require('express');
const taskController = require('../controllers/taskController')
const tokenAuthenticate = require('../middleware/auth')
const validateRequest = require('../middleware/validateRequest')
const { createTaskSchema, updateTaskSchema } = require('../validators/taskValidators')
const authorizeMiddleWare = require('../middleware/authorize');

const router = express.Router();

router.post('/create-task', tokenAuthenticate, validateRequest(createTaskSchema), authorizeMiddleWare, taskController.addTask);
router.post('/get-tasks', tokenAuthenticate, authorizeMiddleWare, taskController.getUserTasks);
router.put('/update-task/:taskId', tokenAuthenticate, validateRequest(updateTaskSchema), authorizeMiddleWare, taskController.updateTask);
router.put('/delete-task/:taskId', tokenAuthenticate, authorizeMiddleWare, taskController.deleteTask);
router.post('/get-all-task', tokenAuthenticate, authorizeMiddleWare, taskController.getAllTask)
router.delete('/delete-all-task',tokenAuthenticate, authorizeMiddleWare, taskController.hardDeleteTask)

module.exports = router;  