const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.route("/admin").get([auth, admin], dashboardController.getAdminDashboard);

module.exports = router;
