const routes = require("express").Router();
const upload = require("../middlewares/upload");
const { check } = require("express-validator");

// controller 
const controller = require("../controllers/pendaftaran_bayar");


// Routes POST 
routes.post("/SimpanPendaftaranPembayaran",  upload, controller.simpanPembayaran);

// Routes GET 
routes.get("/TampilkanDataPendaftaranBayarBerdasarkanPendaftaranId", controller.getByIdPendaftaran);


// routes.get("/:id", controller.getDetail);

// // Routes PUT
// routes.put("/:id", upload, controller.update);


// // Routes DELETE
// routes.delete("/:id", controller.delete);

module.exports = routes;