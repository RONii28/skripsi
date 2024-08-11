const routes = require("express").Router();
const upload = require("multer")();
// controller 
const controller = require("../controllers/user");

// Routes GET 
routes.get("/TampilkanSemuaDataUser", controller.getAll);
// routes.get("/TampilkanDataBerdasarkanId", controller.getDetail);



// // Routes PUT
// routes.put("/:id", upload.none(), controller.update);

// Routes PATCH 
// routes.patch("/avatar", controller.changeAvatar);

// Routes DELETE
routes.delete("/:id", controller.delete);

module.exports = routes;