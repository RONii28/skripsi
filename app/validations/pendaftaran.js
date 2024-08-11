const Joi = require("joi");
// const mapel = require("./mapel");

module.exports = Joi.object({
    siswa_id: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "siswa_id is required",
            "date.empty": "siswa_id cannot be empty",
            "date.base": "siswa_id must be a valid date"
        }),
    mapel_id: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "mapel_id is required",
            "date.empty": "mapel_id cannot be empty",
            "date.base": "mapel_id must be a valid date"
        }),
    biaya_pendaftaran: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "biaya pendaftaran is required",
            "string.empty": "biaya pendaftaran cannot be empty",
            "string.base": "biaya pendaftaran must be a text"
        }),
    status_bayar: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "status_bayar is required",
            "string.empty": "status_bayar cannot be empty",
            "string.base": "status_bayar must be a text"
        }),
});