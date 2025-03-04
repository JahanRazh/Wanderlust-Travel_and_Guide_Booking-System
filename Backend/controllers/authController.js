const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Create a new user account
const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validate that all required fields are provided
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: true, message: "All fields are required" });
    }

    // Check if a user with the same email already exists
    const isUser = await User.findOne({ email });
    if (isUser) {
      return res.status(400).json({ error: true, message: "User already exists" });
    }

    // Hash the password using bcrypt with a salt factor of 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance with the provided details
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await user.save();

    // Generate a JWT access token for the new user
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "72h" }
    );

    // Return a success response with the user details and access token
    return res.status(201).json({
      error: false,
      user: { fullName: user.fullName, email: user.email },
      accessToken,
      message: "Account created successfully",
    });
  } catch (err) {
    // Handle any errors that occur during account creation
    console.error("Error during account creation:", err.message);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

// Handle user login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate that both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: true, message: "All fields are required" });
    }

    // Find the user by email in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: true, message: "User does not exist" });
    }

    // Compare the provided password with the hashed password in the database
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: true, message: "Invalid password" });
    }

    // Generate a JWT access token for the authenticated user
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "72h" }
    );

    // Return a success response with the user details and access token
    return res.status(200).json({
      error: false,
      user: { fullName: user.fullName, email: user.email },
      accessToken,
      message: "Login successful",
    });
  } catch (err) {
    // Handle any errors that occur during login
    console.error("Error during login:", err.message);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

module.exports = {
  register,
  login
};