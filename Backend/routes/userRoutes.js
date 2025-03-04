const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");

// Route to get user details (requires authentication)
router.get("/get-user", authenticateToken, userController.getUser);

module.exports = router;

