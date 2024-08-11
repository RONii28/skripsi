const Joi = require("joi");

module.exports = Joi.object({
    email: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "email cannot be empty",
            "string.base": "email must be a text"
        }),
    password: Joi.string()
        .min(8)
        .max(20)
        .required()
        .trim()
        .messages({
        "any.required": "password cannot be empty",
        "string.base": "password must be a text",
        "string.min": "length password minimal 8 character",
        "string.max": "length password maximal 20 character"
        }),
    telegramId: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "telegramId cannot be empty",
            "string.base": "telegramId must be a text"
        }),
    
});