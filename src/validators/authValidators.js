const Joi = require('joi');

const userRegisterSchema = Joi.object({
    name: Joi
        .string()
        .min(3)
        .max(30)
        .required()
        .messages({
            'any.required': 'Name is required',
            'string.empty': 'Name cannot be empty',
            'string.min': 'Name should have at least 3 characters',
            'string.max': 'Name cannot exceed 30 characters'
        }),
    
    email: Joi
        .string()
        .email()
        .required() //use regex
        .messages({
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Please enter a valid email address'
        }),
    
    mobileNo: Joi
        .string()
        .pattern(/^[6-9]\d{9}$/)
        .required()
        .messages({
            'any.required': 'Mobile number is required',
            'string.empty': 'Mobile number cannot be empty',
            'string.pattern.base': 'Mobile number must be 10 digits and start with 6, 7, 8, or 9' //pick from constants 
        }),
    
    username: Joi
        .string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
            'any.required': 'Username is required',
            'string.empty': 'Username cannot be empty',
            'string.alphanum': 'Username must only contain alphanumeric characters',
            'string.min': 'Username should have at least 3 characters',
            'string.max': 'Username cannot exceed 30 characters'
        }),
    
    password: Joi
        .string()
        .min(6)
        .required()
        .messages({
            'any.required': 'Password is required',
            'string.empty': 'Password cannot be empty',
            'string.min': 'Password should have at least 6 characters'
        }),

    role: Joi
        .string()
        .valid('admin','manager','user')
        .required()
});

const userLoginSchema = Joi.object({
    username: Joi
        .string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
            'any.required': 'Username is required',
            'string.empty': 'Username cannot be empty',
            'string.alphanum': 'Username must only contain alphanumeric characters',
            'string.min': 'Username should have at least 3 characters',
            'string.max': 'Username cannot exceed 30 characters'
        }),
    
    password: Joi
        .string()
        .min(6)
        .required() //use regex
        .messages({
            'any.required': 'Password is required',
            'string.empty': 'Password cannot be empty',
            'string.min': 'Password should have at least 6 characters'
        })
});

module.exports = {
    userRegisterSchema,
    userLoginSchema
};

// apisPostRequestValidator = {
//   body: {
//     username: "abc"
//     }}