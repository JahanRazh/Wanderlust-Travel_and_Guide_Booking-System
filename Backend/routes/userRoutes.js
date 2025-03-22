const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Route to get user details (requires authentication)
router.get("/get-user", authenticateToken, userController.getUser);

// Route to get user details (requires authentication)
router.get("/get-user/:userId", authenticateToken, userController.getUserById);

// Get all users
router.get("/get-users", authenticateToken, userController.getUsers);

// Update user profile with file upload
router.put("/user/update-profile", authenticateToken, upload.single('profileImage'), userController.updateProfile);

// Delete a user
router.delete("/user/:userId", authenticateToken, userController.deleteUser);

module.exports = router;