// Import necessary packages
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Import database connection
const connectDB = require("./config/database");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const storyRoutes = require("./routes/storyRoutes");

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Use routes
app.use("/", authRoutes); // Authentication routes
app.use("/", userRoutes);  // User routes
app.use("/", storyRoutes); // Travel story routes

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the Express app for testing
module.exports = app;