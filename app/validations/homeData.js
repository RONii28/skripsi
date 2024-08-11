const Joi = require("joi");

const homeData = Joi.object({
    total_siswa: Joi.number().integer().required(),
    total_kategori: Joi.number().integer().required(),
    total_mapel: Joi.number().integer().required(),
    total_mentor: Joi.number().integer().required(),
    total_belum: Joi.number().integer().required(),
    total_lunas: Joi.number().integer().required(),
    total_pending: Joi.number().integer().required(),
    total_tolak: Joi.number().integer().required(),
    biaya_per_bulan: Joi.object().pattern(Joi.number().integer(), Joi.number().precision(2).required())
  });

module.exports = homeData;