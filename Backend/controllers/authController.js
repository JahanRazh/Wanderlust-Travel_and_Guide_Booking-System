const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Register a new user
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

// Login an existing user
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
      user: { fullName: user.fullName, email: user.email, role: user.role },//by role identify the user or admin
      accessToken,
      message: "Login successful",
    });
  } catch (err) {
    // Handle any errors that occur during login
    console.error("Error during login:", err.message);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

// Forgot Password: Send a reset link to the user's email
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: true, message: "Email is required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // For security reasons, don't reveal that the user doesn't exist
      return res.status(200).json({
        error: false,
        message: "If your email is registered, you will receive a password reset link",
      });
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the token for storage (so it's not stored in plain text)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set token expiration (1 hour)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create reset URL with the plaintext token (for the user)
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    // Configure email transport with proper error handling
    let transporter;
    try {
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } catch (error) {
      console.error("Email configuration error:", error);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
      return res.status(500).json({ error: true, message: "Email service configuration error" });
    }

    // Email content
    const mailOptions = {
      from: `"WANDERLUST" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p className="text-3xl font-bold"><span className="text-blue-500">WANDER</span>LUST</p>
          <h2 style="color: #0284c7;">Reset Your Password</h2>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <div style="margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #0284c7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
          </div>
          <p>This link will expire in 1 hour.</p>
          <p style="color: #666;">If you didn't request this, please ignore this email and your password will remain unchanged.</p>
        </div>
      `,
    };

    // Send email with error handling
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: true, message: "Failed to send reset email" });
    }

    // Always return success, even if user doesn't exist (security)
    return res.status(200).json({
      error: false,
      message: "If your email is registered, you will receive a password reset link",
    });
  } catch (err) {
    console.error("Forgot password error:", err.message);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

// Reset Password: Update the user's password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: true, message: "Token and new password are required" });
    }

    // Password strength validation
    if (newPassword.length < 8) {
      return res.status(400).json({
        error: true,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hash the received token to match against stored hash
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with valid token and non-expired reset timestamp
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: true, message: "Invalid or expired reset token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user with new password and clear reset fields
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "72h" }
    );

    return res.status(200).json({
      error: false,
      accessToken,
      message: "Password reset successful",
    });
  } catch (err) {
    console.error("Reset password error:", err.message);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};