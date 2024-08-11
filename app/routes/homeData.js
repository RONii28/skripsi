const routes = require("express").Router();

const controller = require("../controllers/homeData");

routes.get("/", controller.getHome);

module.exports = routes;