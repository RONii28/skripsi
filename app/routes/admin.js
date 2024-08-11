const routes = require("express").Router();
const upload = require("multer")();
// controller 
const controller = require("../controllers/admin");

// Routes POST 
routes.post("/", upload.none(), controller.create)

// Routes GET 
routes.get("/TampilkanSemuaDataAdmin", controller.getAll);
routes.get("/:id", controller.getDetail);



// Routes PUT
routes.put("/:id", upload.none(), controller.update);

// Routes PATCH 
// routes.patch("/avatar", controller.changeAvatar);

// Routes DELETE
routes.delete("/:id", controller.delete);

module.exports = routes;