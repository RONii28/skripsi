const Joi = require("joi");

module.exports = Joi.object({
    mentor_id: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "mentor_id is required",
            "string.empty": "mentor_id cannot be empty",
            "string.base": "mentor_id must be a text"
        }),
        
    

    nama_kategori: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "nama kategori is required",
            "string.empty": "nama kategori cannot be empty",
            "string.base": "nama kategori must be a text"
        }),

    tingkat: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "tingkat is required",
            "string.empty": "tingkat cannot be empty",
            "string.base": "tingkat must be a text"
        }),
});