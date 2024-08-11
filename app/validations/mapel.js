const Joi = require("joi");

module.exports = Joi.object({
    kategori_id: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "kategori_id is required",
            "string.empty": "kategori_id cannot be empty",
            "string.base": "kategori_id must be a text"
        }),
    

    nama_mapel: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "nama mapel is required",
            "string.empty": "nama mapel cannot be empty",
            "string.base": "nama mapel must be a text"
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