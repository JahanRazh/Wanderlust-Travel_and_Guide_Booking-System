const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Route to create a new user account
router.post("/create-account", authController.register);

// Route to handle user login
router.post("/login", authController.login);

module.exports = router;