const Joi = require("joi");

module.exports = Joi.object({
    email: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "email cannot be empty",
            "string.base": "email must be a text"
        }), 


    verificationCode: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "verificationCode cannot be empty",
            "string.base": "verificationCode must be a text"
        }),
});