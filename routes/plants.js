const express = require("express");
const router = express.Router();
const plantController = require("../controllers/plantController");
const auth = require("../middleware/auth");

router.route("/").get([auth], plantController.getAllPlants);
router.route("/").post([auth], plantController.addPlant);

module.exports = router;

// {
//     "name":"Tomato ",
//     "description":"used in salad",
//     "longitude":"180",
//     "latitude":"90",
//     "categoryIds":["6603142f3c0f77d3574212e3", "6603143c3c0f77d3574212e6"]
// }
