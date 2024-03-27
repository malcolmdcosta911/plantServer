const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

router.route("/").post(authController.login); //user login

router.route("/admin").post(authController.adminLogin); //admin login
router.route("/verify-phone").post(authController.verifyPhone);
router.route("/verify-otp").post(authController.verifyOtp);
// router.route("/reset-password").post([auth], authController.resetPassword); //should be as secure as login hence auth middleware
router.route("/reset-password").post(authController.resetPassword); //should be as secure as login hence auth middleware

module.exports = router;
