const routes = require("express").Router();

// // middleware
// const authorize = require("../middlewares/authorize");

routes.use("/v1/auth", require("./auth"));
routes.use("/v1/user", require("./user"));
routes.use("/v1/admin", require("./admin"));
routes.use("/v1/siswa", require("./siswa"));
routes.use("/v1/mentor", require("./mentor"));
routes.use("/v1/kategori", require("./kategori"));
routes.use("/v1/mapel", require("./mapel"));
routes.use("/v1/pendaftaran", require("./pendaftaran"));
routes.use("/v1/pendaftaran_bayar", require("./pendaftaran_bayar"));
routes.use("/v1/notifikasi", require("./notifikasi"));
routes.use("/v1/homeData", require("./homeData"));

module.exports = routes;