const bodyParser = require("body-parser");
const error = require("../middleware/error");
const users = require("../routes/users");
const auth = require("../routes/auth");
const plantCategories = require("../routes/plantCategories");
const plants = require("../routes/plants");
const dashboard = require("../routes/dashboard");

// const uploadPlants = require("../utils/filesHandler");
const express = require("express");
const cookieParser = require("cookie-parser");

module.exports = function (app) {
  app.use(bodyParser.json()); // parse application/json
  app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
  // app.use(uploadPlants.array("plantImages", 3));
  app.use(express.static("public"));
  app.use(cookieParser());
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/plant-categories", plantCategories);
  app.use("/api/plants", plants);
  app.use("/api/dashboard", dashboard);
  app.use(error);
};
