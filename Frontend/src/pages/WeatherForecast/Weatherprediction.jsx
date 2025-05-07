import React, { useState } from 'react';
import axios from 'axios';
const WeatherPrediction = () => {
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    try {
      const res = await axios.post('http://localhost:3000/predict', { city, date });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-2">Weather Forecast</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          Get Forecast
        </button>
      </form>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {result && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <h3 className="font-semibold">{result.city} on {result.date}</h3>
          <p>🌡️ Temperature: {result.temperature}</p>
          <p>🌧️ Rainfall: {result.rainfall}</p>
          <p>🌤️ Conditions: {result.conditions}</p>
        </div>
      )}
    </div>
  );
};

export default WeatherPrediction;
