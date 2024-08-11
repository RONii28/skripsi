const Joi = require("joi");

module.exports = Joi.object({
  email: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "email is required",
            "string.empty": "email cannot be empty",
            "string.base": "email must be a text"
        })
});
