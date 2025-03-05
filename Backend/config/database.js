const mongoose = require("mongoose");
const config = require("./config.json");
//data base
const connectDB = async () => {
  try {
    await mongoose.connect(config.connectionString);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;