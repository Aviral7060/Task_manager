const Joi = require('joi')

const createTaskSchema = Joi.object({
    task: Joi
        .string()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.base": '"Title" should be a type of string',
            "string.min": '"Title" should have a minimum length of 3 characters',
            "string.max": '"Title" should not exceed 100 characters',
            "any.required": '"Title" is a required field',
        }),
    description: Joi
        .string()
        .max(500)
        .required()
        .messages({
            "string.base": '"Description" should be a type of string',
            "string.max": '"Description" should not exceed 500 characters',
            "any.required": '"Description" is a required field',
        }),
    status: Joi
        .string()
        .valid("pending", "successful","deleted")
        .required()
        .messages({
            "any.only": "Status must be either 'pending' or 'successful'",
            "string.empty": "Status is required"
        }),

});

const updateTaskSchema = Joi.object({
    taskId: Joi
        .string()
        .required()
        .messages({
            "string.base": '"Task ID" should be a type of string',
            "any.required": '"Task ID" is a required field',
        }),
    task: Joi
        .string()
        .min(3)
        .max(100)
        .optional()
        .messages({
            "string.base": '"Title" should be a type of string',
            "string.min": '"Title" should have a minimum length of 3 characters',
            "string.max": '"Title" should not exceed 100 characters',
            "any.optional": '"Title" is a optional field'
        }),
    description: Joi
        .string()
        .max(500)
        .optional()
        .messages({
            "string.base": '"Description" should be a type of string',
            "string.max": '"Description" should not exceed 500 characters',
            "any.optional": '"Description" is a optional field',
        }),
    status: Joi
        .string()
        .valid("pending", "completed")
        .optional()
        .messages({
            "any.only": "Status must be either 'pending' or 'successful'",
            "string.empty": "Status is required"
        })
}).or("title", "description", "status");

module.exports = {
    createTaskSchema,
    updateTaskSchema
}