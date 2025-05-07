import React, { useState } from 'react';
import axios from 'axios';

const WeatherPrediction = () => {
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:3000/predict', { city, date });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const validateCity = (cityName) => {
    if (!/^[A-Z]/.test(cityName)) {
      setError('City name must start with a capital letter');
      return false;
    }
    return true;
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">Weather Forecast</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (validateCity(city)) {
            handleSubmit(e);
          }
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            Location (ex Colombo)
          </label>
          <input
            id="city"
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
          />
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-lg font-medium text-white transition-colors ${
            isLoading 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isLoading ? 'Loading...' : 'Get Forecast'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 p-5 bg-white rounded-lg shadow-md border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            {result.city} <span className="text-gray-500">on</span> {result.date}
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🌡️</span>
              <div>
                <p className="text-sm text-gray-500">Temperature</p>
                <p className="font-medium text-indigo-600">{result.temperature}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-2xl mr-2">🌧️</span>
              <div>
                <p className="text-sm text-gray-500">Rainfall</p>
                <p className="font-medium text-blue-600">{result.rainfall}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-2xl mr-2">🌤️</span>
              <div>
                <p className="text-sm text-gray-500">Conditions</p>
                <p className="font-medium text-green-600">{result.conditions}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherPrediction;