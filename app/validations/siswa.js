const Joi = require('joi');

const siswa = Joi.object({
  user_id: Joi.string()
    .required()
    .trim()
    .messages({
      "any.required": "user_id is required",
      "string.empty": "user_id cannot be empty",
      "string.base": "user_id must be a text"
    }),
  nama_siswa: Joi.string()
    .required()
    .trim()
    .messages({
      "any.required": "nama siswa is required",
      "string.empty": "nama siswa cannot be empty",
      "string.base": "nama siswa must be a text"
    }),
  alamat_siswa: Joi.string()
    .required()
    .trim()
    .messages({
      "any.required": "alamat siswa is required",
      "string.empty": "alamat siswa cannot be empty",
      "string.base": "alamat siswa must be a text"
    }),
  jk_siswa: Joi.string()
    .required()
    .trim()
    .messages({
      "any.required": "jenis kelamin siswa is required",
      "string.empty": "jenis kelamin siswa cannot be empty",
      "string.base": "jenis kelamin siswa must be a text"
    }),
  tl_siswa: Joi.string()
    .required()
    .trim()
    .messages({
      "any.required": "tanggal lahir siswa is required",
      "string.empty": "tanggal lahir siswa cannot be empty",
      "string.base": "tanggal lahir siswa must be a text"
    }),
  no_hp_siswa: Joi.string()
    .required()
    .trim()
    .messages({
      "any.required": "no hp siswa is required",
      "string.empty": "no hp siswa cannot be empty",
      "string.base": "no hp siswa must be a text"
    }),
});

const updateSiswa = Joi.object({
  nama_siswa: Joi.string()
    .optional()
    .trim()
    .messages({
      "string.empty": "nama siswa cannot be empty",
      "string.base": "nama siswa must be a text"
    }),
  alamat_siswa: Joi.string()
    .optional()
    .trim()
    .messages({
      "string.empty": "alamat siswa cannot be empty",
      "string.base": "alamat siswa must be a text"
    }),
  jk_siswa: Joi.string()
    .optional()
    .trim()
    .messages({
      "string.empty": "jenis kelamin siswa cannot be empty",
      "string.base": "jenis kelamin siswa must be a text"
    }),
  tl_siswa: Joi.string()
    .optional()
    .trim()
    .messages({
      "string.empty": "tanggal lahir siswa cannot be empty",
      "string.base": "tanggal lahir siswa must be a text"
    }),
  no_hp_siswa: Joi.string()
    .optional()
    .trim()
    .messages({
      "string.empty": "no hp siswa cannot be empty",
      "string.base": "no hp siswa must be a text"
    }),
});

module.exports = { siswa, updateSiswa };
