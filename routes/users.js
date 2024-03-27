const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const auth = require("../middleware/auth");

router.route("/").post(usersController.register);
router.route("/me").get([auth], usersController.userProfile);

module.exports = router;
