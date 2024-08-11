const routes = require("express").Router();
const upload = require("multer")();
const { check } = require("express-validator");
// controller 
const controller = require("../controllers/pendaftaran");

// Routes POST 
routes.post("/SimpanDataPendaftaran", upload.none(), controller.simpanPendaftaran)
routes.post('/update-status-bayar', upload.none(), controller.updateStatusBayar);

// Routes GET 
routes.get("/TampilkanSemuaDataPendaftaran", controller.getAllPendaftaran);
routes.get("/TampilkanDataBerdasarkanSiswaId", controller.getPendaftaranBySiswaId);

// Routes DELETE
routes.delete("/:id", controller.delete);

module.exports = routes;