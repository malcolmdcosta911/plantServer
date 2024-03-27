const express = require("express");
const router = express.Router();
const plantCategoryController = require("../controllers/plantCategoryController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.route("/").get([auth], plantCategoryController.getAllCategories);
router.route("/").post([auth, admin], plantCategoryController.addCategory);

module.exports = router;
