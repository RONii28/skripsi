const routes = require("express").Router();
const upload = require("multer")();
// controller 
const controller = require("../controllers/auth");

// Routes POST 
routes.post("/registerSiswa", upload.none(), controller.registerUser);
routes.post("/loginSiswa", upload.none(), controller.loginSiswa);
routes.post("/loginAdmin", upload.none(), controller.loginAdmin);
// logout
// routes.post("/logout", controller.logout);


module.exports = routes;