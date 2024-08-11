const Joi = require("joi");

module.exports = Joi.object({
    user_id: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "user_id is required",
            "string.empty": "user_id cannot be empty",
            "string.base": "user_id must be a text"
        }),
    

    nama_admin: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "nama admin is required",
            "string.empty": "nama admin cannot be empty",
            "string.base": "nama admin must be a text"
        }),
    


    alamat_admin: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "alamat admin is required",
            "string.empty": "alamat admin cannot be empty",
            "string.base": "alamat admin must be a text"
        }),
    
    jk_admin : Joi.string()
    .required()
    .trim()
    .messages({
        "any.required": " jenis kelamin admin is required",
        "string.empty": " jenis kelamin admin cannot be empty",
        "string.base": " jenis kelamin admin must be a text"
    }),

    tl_admin : Joi.string()
    .required()
    .trim()
    .messages({
        "any.required": " tanggal lahir admin is required",
        "string.empty": " tanggal lahir admin cannot be empty",
        "string.base": " tanggal lahir admin must be a text"
    }),
    
    no_hp_admin : Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "no hp admin is required",
            "string.empty": "no hp admin cannot be empty",
            "string.base": "no hp admin must be a text"
        }),
});