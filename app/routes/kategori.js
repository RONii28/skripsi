const routes = require("express").Router();
const upload = require("multer")();
const controller = require("../controllers/kategori")



// tambah data
routes.post("/TambahDataKategori", upload.none(), controller.create)

// nampilkan data
routes.get("/TampilkanSemuaDataKategori", controller.getAllKategori);
routes.get("/SemuaDataKategoriBerdasarkanMentorId", controller.getDataBymentorId);

// Routes PUT
routes.post("/updateDataKategori", upload.none(), controller.updateKategori);

// Routes PATCH 
// routes.patch("/avatar", controller.changeAvatar);

// // Routes DELETE
// routes.delete("/:id", controller.delete);

module.exports = routes;