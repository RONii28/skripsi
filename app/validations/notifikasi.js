const Joi = require("joi");

module.exports = Joi.object({
    admin_id: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "admin_id is required",
            "string.empty": "admin_id cannot be empty",
            "string.base": "admin_id must be a text"
        }),

    jenis_notifikasi: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "jenis_notifikasi is required",
            "string.empty": "jenis_notifikasi cannot be empty",
            "string.base": "jenis_notifikasi must be a text"
        }),
    
    isi_notifikasi: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "isi_notifikasi is required",
            "string.empty": "isi_notifikasi cannot be empty",
            "string.base": "isi_notifikasi must be a text"
        }),
});