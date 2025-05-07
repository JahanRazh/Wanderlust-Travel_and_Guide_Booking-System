// routes/weatherRoutes.js
const express = require("express");
const router = express.Router();
const { predictWeather } = require("../../controllers/Weather/weatherController");

router.post("/predict", predictWeather);

module.exports = router;
