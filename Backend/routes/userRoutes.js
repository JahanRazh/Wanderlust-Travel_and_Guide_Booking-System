const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const User = require("../models/user.model")
const { authenticateToken } = require("../middleware/auth");
const upload = require("../middleware/upload");



// Route to get user details (requires authentication)
router.get("/get-user", authenticateToken, userController.getUser);

// Route to get user details (requires authentication)
router.get("/get-user/:userId", authenticateToken, userController.getUserById);

router.get("/users/count", async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all users
router.get("/get-users", authenticateToken, userController.getUsers);

// Update user profile with file upload
router.put("/user/update-profile", authenticateToken, upload.single('profileImage'), userController.updateProfile);

// Delete a user
router.delete("/user/:userId", authenticateToken, userController.deleteUser);

module.exports = router;