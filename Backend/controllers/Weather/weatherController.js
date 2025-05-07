
const { spawn } = require("child_process");

const predictWeather = (req, res) => {
  const { city, date } = req.body;

  const python = spawn("python", ["./weather_export.py", city, date]);

  let output = "";
  python.stdout.on("data", (data) => {
    output += data.toString();
  });

  python.stderr.on("data", (data) => {
    console.error("Python error:", data.toString());
  });

  python.on("close", (code) => {
    try {
      const weatherData = JSON.parse(output);
      res.json(weatherData);
    } catch (err) {
      console.error("JSON Parse Error:", err.message);
      res.status(500).json({ error: "Failed to parse weather data" });
    }
  });
};

module.exports = { predictWeather };
