const Joi = require("joi");

module.exports = Joi.object({
  password: Joi.string().min(8).max(20).required().trim().messages({
    "any.required": "password is required",
    "string.empty": "password cannot be empty",
    "string.base": "password must be a text",
    "string.min": "length password minimal 8 character",
    "string.max": "length password maximum 20 character",
  }),
  confirm_password: Joi.string().min(8).max(20).required().trim().messages({
    "any.required": "confirm password is required",
    "string.empty": "confirm password cannot be empty",
    "string.base": "confirm password must be a text",
    "string.min": "length confirm password minimal 8 character",
    "string.max": "length confirm password maximum 20 character",
  }),
});
