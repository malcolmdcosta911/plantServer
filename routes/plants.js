const express = require("express");
const router = express.Router();
const plantController = require("../controllers/plantController");
const auth = require("../middleware/auth");
// const admin = require("../middleware/admin");

router.route("/").get([auth], plantController.getAllPlants);
router.route("/").post([auth], plantController.addPlant);

module.exports = router;
