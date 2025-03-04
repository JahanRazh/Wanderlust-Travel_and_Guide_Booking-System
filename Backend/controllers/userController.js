const User = require("../models/user.model");

// Get user details
const getUser = async (req, res) => {
  try {
    const { userId } = req.user;

    // Find the user by userId in the database
    const isUser = await User.findOne({ _id: userId });

    // If the user is not found, return a 401 Unauthorized status
    if (!isUser) {
      return res.sendStatus(401);
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

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    const { userId } = req.user;
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: true, message: "No file uploaded" });
    }
    
    // Get the file path
    const filePath = `/uploads/${req.file.filename}`;
    
    // Update user document with profile image path
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: filePath },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ error: true, message: "User not found" });
    }
    
    // Return success response with image URL
    return res.status(200).json({
      error: false,
      imageUrl: filePath,
      message: "Profile picture updated successfully"
    });
    
  } catch (err) {
    console.error("Error uploading profile picture:", err.message);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

module.exports = {
  getUser,
  uploadProfilePicture
};