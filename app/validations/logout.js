const Joi = require("joi");

module.exports = Joi.object({
    token: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "token cannot be empty",
            "string.base": "token must be a text"
        }),
});