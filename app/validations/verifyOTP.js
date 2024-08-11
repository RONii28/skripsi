const Joi = require("joi");

module.exports = Joi.object({
    otp: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "otp cannot be empty",
            "string.base": "otp must be a text"
        }),
});