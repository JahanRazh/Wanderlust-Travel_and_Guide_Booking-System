// Import necessary packages
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require('fs');

// Import database connection
const connectDB = require("./config/database");

// Import routes
const weatherRoutes = require('./routes/Weather/weatherRoutes');
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const storyRoutes = require("./routes/storyRoutes");
const packageRoute = require("./routes/Admin/packageRoute");
const hotelRoute = require("./routes/Admin/hotelRoute");
const bookingRoute = require("./routes/Admin/bookingRoute");
const guideRoute = require("./routes/Guide/guideRoutes");
const uploadDir = path.join(__dirname, 'uploads/packages4to');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Use routes
app.use("/", authRoutes); // Authentication routes
app.use("/", userRoutes);  // User routes
app.use("/", storyRoutes); // Travel story routes
app.use("/", packageRoute); // Package routes
app.use("/", hotelRoute); // Hotel routes
app.use("/", weatherRoutes); // Weather routes
app.use("/", bookingRoute); // Booking routes
app.use("/", guideRoute); // Guide routes


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the Express app for testing
module.exports = app;

// Add to your main server file
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Consider proper error handling/restart here
});
