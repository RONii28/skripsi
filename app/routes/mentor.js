const routes = require("express").Router();
const upload = require("multer")();
const { check } = require("express-validator");
// controller 
const controller = require("../controllers/mentor");
const { required } = require("joi");

// Routes POST 
routes.post("/TambahDataMentor", upload.none(), controller.addMentor)

// Routes GET 
routes.get("/TampilkanSemuaDataMentor", controller.getAllMentors);
routes.get("/TampilkanDataMentorByUserid", controller.getMentorByUserId);

// Routes PUT
routes.post('/updateMentor',upload.none(), controller.updateMentor);

// Routes PATCH 
// routes.patch("/avatar", controller.changeAvatar);

// Routes DELETE
routes.delete("/:id", controller.delete);

module.exports = routes;