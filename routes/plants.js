const express = require("express");
const router = express.Router();
const plantController = require("../controllers/plantController");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const admin = require("../middleware/admin");

router.route("/").get([auth], plantController.getAllPlants);
router
  .route("/:id")
  .get([auth, validateObjectId], plantController.getPlantByID);
router.route("/").post([auth], plantController.addPlant);
router
  .route("/:id")
  .put([auth, admin, validateObjectId], plantController.updatePlant); //only admin
router
  .route("/:id")
  .delete([auth, admin, validateObjectId], plantController.deletePlant); //only admin

module.exports = router;
