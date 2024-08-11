const Joi = require("joi");

module.exports = Joi.object({
    pendaftaran_id: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "pendaftaran_id is required",
            "date.empty": "pendaftaran_id cannot be empty",
            "date.base": "pendaftaran_id must be a text"
        }),
        
    tanggal: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "tanggal pendaftaran is required",
            "string.empty": "tanggal pendaftaran cannot be empty",
            "string.base": "tanggal pendaftaran must be a valid date"
        }),
});