// authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Route to create a new user account
router.post("/create-account", authController.register);

// Route to handle user login
router.post("/login", authController.login);

// Route to handle forgot password
router.post("/forgot-password", authController.forgotPassword);

// Route to handle reset password
router.post("/reset-password", authController.resetPassword);

module.exports = router;