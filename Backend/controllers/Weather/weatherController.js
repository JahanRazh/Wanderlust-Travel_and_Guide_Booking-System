const { spawn } = require("child_process");

const predictWeather = (req, res) => {
  const { city, date } = req.body;

  // Validate inputs
  if (!city || !date) {
    return res.status(400).json({ error: "City and date are required" });
  }

  // Validate city name format
  if (!/^[A-Z][a-zA-Z\s-]*$/.test(city)) {
    return res.status(400).json({ 
      error: "City name must start with a capital letter and contain only letters, spaces, or hyphens"
    });
  }

  const python = spawn("python", ["./weather_export.py", city, date]);

  let output = "";
  let errorOutput = "";

  python.stdout.on("data", (data) => {
    output += data.toString();
  });

  python.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  python.on("close", (code) => {
    if (code !== 0) {
      console.error("Python script failed:", errorOutput);
      return res.status(500).json({ 
        error: "Weather prediction service is currently unavailable" 
      });
    }

    try {
      const weatherData = JSON.parse(output);
      
      // Handle cases where city isn't found
      if (weatherData.error) {
        return res.status(404).json({ 
          error: `Weather data not available for ${city}` 
        });
      }

      // Validate the response structure
      if (!weatherData.city || !weatherData.date || 
          !weatherData.temperature || !weatherData.rainfall || !weatherData.conditions) {
        console.error("Invalid data structure from Python script:", weatherData);
        return res.status(500).json({ 
          error: "Received incomplete weather data" 
        });
      }

      res.json(weatherData);
    } catch (err) {
      console.error("JSON Parse Error:", err.message);
      console.error("Raw Python output:", output);
      res.status(500).json({ 
        error: "Failed to process weather data" 
      });
    }
  });
};

module.exports = { predictWeather };