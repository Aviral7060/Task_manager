const express = require('express');
const router = express.Router();
const userController = require('../controllers/authController') //authController
const validateRequest = require('../middleware/validateRequest')
const { userRegisterSchema, userLoginSchema } = require('../validators/authValidators')

router.post('/register', validateRequest(userRegisterSchema), userController.signUp);
router.post('/login', validateRequest(userLoginSchema), userController.loginUser);


module.exports = router;