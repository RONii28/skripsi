const routes = require("express").Router();
const upload = require("multer")();
// controller 
const controller = require("../controllers/mapel");

// Routes POST 
routes.post("/TambahDataMapel", upload.none(), controller.addMapel)

// Routes GET 
routes.get("/TampilkanSemuaDataMapel", controller.getAllMapel);
routes.get("/TampilkanDataMapelByKategori", controller.getMapelsByKategori);

// Routes PUT
routes.post("/UpdateDataMapel", upload.none(), controller.updateMapel);


// Routes DELETE
routes.delete("/:id", controller.delete);

module.exports = routes;