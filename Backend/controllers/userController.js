const User = require("../models/user.model");
const fs = require("fs");
const path = require("path");

// Get user details
const getUser = async (req, res) => {
  try {
    const { userId } = req.user; // Get userId from URL params

    // Find the user by userId in the database
    const isUser = await User.findOne({ _id: userId });

    // If the user is not found, return a 404 Not Found status
    if (!isUser) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    // Return the user details in the response
    return res.json({
      user: isUser,
      message: "",
    });
  } catch (err) {
    console.error("Error fetching user:", err.message);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

// Get user details by id (admin only)
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from req.user

    // Find the user by userId in the database
    const isUser = await User.findOne({ _id: userId });

    // If the user is not found, return a 404 Not Found status
    if (!isUser) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    // Return the user details in the response
    return res.json({
      user: isUser,
      message: "",
    });
  } catch (err) {
    console.error("Error fetching user:", err.message);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({});

    // Return the list of users in the response
    return res.json({
      users,
      message: "Users fetched successfully",
    });
  } catch (err) {
    console.error("Error fetching users:", err.message);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

// Helper function to delete a file
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath); // Delete the file
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId } = req.user; // The ID of the user making the request
    const { targetUserId } = req.body; // The ID of the user whose profile is being updated
    const updateData = req.body;

    // Determine if the requesting user is an admin
    const requestingUser = await User.findById(userId);
    const isAdmin = requestingUser.role === 'admin'; // Check if the user has an 'admin' role

    // If the user is not an admin, they can only update their own profile
    if (!isAdmin && targetUserId && targetUserId !== userId) {
      return res.status(403).json({ error: true, message: "Forbidden: You can only update your own profile" });
    }

    // Determine which user ID to use for the update
    const userIdToUpdate = isAdmin && targetUserId ? targetUserId : userId;

    // Find the user
    const user = await User.findById(userIdToUpdate);
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    // If a new profile image is uploaded
    if (req.file) {
      // Delete the old profile image if it exists
      if (user.profileImage) {
        const oldImagePath = path.join(__dirname, "..", user.profileImage);
        deleteFile(oldImagePath);
      }

      // Save the new profile image path
      updateData.profileImage = req.file.path;
    }

    // Update the user profile
    const updatedUser = await User.findByIdAndUpdate(userIdToUpdate, updateData, { new: true });

    return res.json({
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.error("Error updating profile:", err.message);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};
// Delete a user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    // Delete the user's profile image if it exists
    if (user.profileImage) {
      const imagePath = path.join(__dirname, "..", user.profileImage);
      deleteFile(imagePath);
    }

    // Delete the user from the database
    await User.findByIdAndDelete(userId);

    return res.json({
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting user:", err.message);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

module.exports = {
  getUser,
  getUserById,
  getUsers,
  updateProfile,
  deleteUser,
};