const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Route to get user details (requires authentication)
router.get("/get-user", authenticateToken, userController.getUser);


// Update user profile
router.put("/user/update-profile", authenticateToken, userController.updateProfile);

module.exports = router;