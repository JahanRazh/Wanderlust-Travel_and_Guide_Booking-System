const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  city: String,
  date: Date,
  temperature_mean: Number,
  rainfall_sum: Number,
  weather_code: Number
});

module.exports = mongoose.model('Weather', weatherSchema);
// This model defines the structure of the weather data that will be stored in the MongoDB database. It includes fields for city, date, temperature, rainfall, and weather code.