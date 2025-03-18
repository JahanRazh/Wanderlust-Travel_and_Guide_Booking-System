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
const updateProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const updateData = req.body;

    // Update the user profile
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    return res.json({
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.error("Error updating profile:", err.message);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

module.exports = {
  getUser,
  updateProfile,
};

