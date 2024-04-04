const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.route("/").post(usersController.register);
router.route("/me").get([auth], usersController.userProfile);
router.route("/all").get([auth, admin], usersController.getAllUsers);
module.exports = router;
