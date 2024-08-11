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
    
    nama_mentor: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "nama mentor is required",
            "string.empty": "nama mentor cannot be empty",
            "string.base": "nama mentor must be a text"
        }),
    
    alamat_mentor: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "alamat mentor is required",
            "string.empty": "alamat mentor cannot be empty",
            "string.base": "alamat mentor must be a text"
        }),
    
    jk_mentor : Joi.string()
    .required()
    .trim()
    .messages({
        "any.required": " jenis kelamin mentor is required",
        "string.empty": " jenis kelamin mentor cannot be empty",
        "string.base": " jenis kelamin mentor must be a text"
    }),

    tl_mentor : Joi.string()
    .required()
    .trim()
    .messages({
        "any.required": " tanggal lahir mentor is required",
        "string.empty": " tanggal lahir mentor cannot be empty",
        "string.base": " tanggal lahir mentor must be a text"
    }),
    
    no_hp_mentor : Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "no hp mentor is required",
            "string.empty": "no hp mentor cannot be empty",
            "string.base": "no hp mentor must be a text"
        }),
});