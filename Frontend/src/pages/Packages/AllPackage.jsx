import React, { useEffect, useState } from 'react';
import Footer from '../../components/footer';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Weather Prediction Component
const WeatherPredictionFilter = ({ onWeatherUpdate, areas, setSelectedWeatherArea }) => {
  const [date, setDate] = useState('');
  const [weatherData, setWeatherData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  const handleWeatherCheck = async () => {
    if (!selectedArea || !date) {
      setError('Please select both an area and date');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Use the selected area as city
      const res = await axios.post('http://localhost:3000/predict', { city: selectedArea, date });
      
      const newWeatherData = {
        ...weatherData,
        [selectedArea]: {
          date,
          temperature: res.data.temperature,
          rainfall: res.data.rainfall,
          conditions: res.data.conditions
        }
      };
      
      setWeatherData(newWeatherData);
      onWeatherUpdate(newWeatherData);
      setSelectedWeatherArea(selectedArea);
    } catch (err) {
      setError(err.response?.data?.error || 'Weather prediction failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Weather for Your Trip
      </h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="area-select" className="block text-sm font-medium text-gray-700 mb-1">
            Destination Area
          </label>
          <select
            id="area-select"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select an area</option>
            {areas.map((area, index) => (
              <option key={index} value={area}>{area}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="trip-date" className="block text-sm font-medium text-gray-700 mb-1">
            Trip Date
          </label>
          <input
            id="trip-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <button
          onClick={handleWeatherCheck}
          disabled={isLoading || !selectedArea || !date}
          className={`w-full py-2 px-4 rounded-md font-medium text-white transition ${
            isLoading || !selectedArea || !date
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Checking Weather...' : 'Check Weather'}
        </button>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
          {error}
        </div>
      )}
      
      {Object.keys(weatherData).length > 0 && selectedArea && weatherData[selectedArea] && (
        <div className="mt-5 p-4 bg-blue-50 rounded-md">
          <h4 className="font-medium text-blue-800 mb-2">
            Weather in {selectedArea} on {new Date(weatherData[selectedArea].date).toLocaleDateString()}
          </h4>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white p-2 rounded shadow-sm">
              <div className="text-xl mb-1">🌡️</div>
              <div className="text-xs text-gray-500">Temperature</div>
              <div className="font-medium text-blue-700">{weatherData[selectedArea].temperature}</div>
            </div>
            
            <div className="bg-white p-2 rounded shadow-sm">
              <div className="text-xl mb-1">🌧️</div>
              <div className="text-xs text-gray-500">Rainfall</div>
              <div className="font-medium text-blue-700">{weatherData[selectedArea].rainfall}</div>
            </div>
            
            <div className="bg-white p-2 rounded shadow-sm">
              <div className="text-xl mb-1">🌤️</div>
              <div className="text-xs text-gray-500">Conditions</div>
              <div className="font-medium text-blue-700">{weatherData[selectedArea].conditions}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Individual Package Card Component - Now with Weather Badge
const PackageCard = ({ packageData, weatherData }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasWeatherData = weatherData && weatherData[packageData.area];

  const nextImage = () => {
    if (packageData.images?.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === packageData.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (packageData.images?.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? packageData.images.length - 1 : prevIndex - 1
      );
    }
  };

  // Function to get weather badge color based on conditions
  const getWeatherBadgeColor = (conditions) => {
    const conditionsLower = conditions.toLowerCase();
    if (conditionsLower.includes('sunny') || conditionsLower.includes('clear')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    } else if (conditionsLower.includes('rain') || conditionsLower.includes('shower')) {
      return 'bg-blue-100 text-blue-800 border-blue-300';
    } else if (conditionsLower.includes('cloud')) {
      return 'bg-gray-100 text-gray-800 border-gray-300';
    } else if (conditionsLower.includes('storm') || conditionsLower.includes('thunder')) {
      return 'bg-purple-100 text-purple-800 border-purple-300';
    } else {
      return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.10 }}
    >
      {/* Image Carousel */}
      <div className="relative h-64">
        {packageData.images?.length > 0 ? (
          <>
            <img
              src={packageData.images[currentImageIndex]}
              alt={packageData.packageName}
              className="w-full h-64 object-cover transition duration-300 ease-in-out"
            />
            {packageData.images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <button
                  onClick={prevImage}
                  className="bg-black bg-opacity-40 text-white rounded-full p-2 hover:bg-opacity-60 hover:scale-110 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="bg-black bg-opacity-40 text-white rounded-full p-2 hover:bg-opacity-60 hover:scale-110 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Weather badge if available */}
        {hasWeatherData && (
          <div className="absolute top-2 right-2">
            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getWeatherBadgeColor(weatherData[packageData.area].conditions)}`}>
              {weatherData[packageData.area].conditions}
            </div>
          </div>
        )}
      </div>

      {/* Package Info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900">{packageData.packageName}</h3>
          <div className="bg-emerald-100 text-emerald-800 rounded-full px-3 py-1 text-sm font-semibold">
            ${packageData.pricePerPerson} / person
          </div>
        </div>

        {/* Package Details */}
        <div className="space-y-3 mb-6 text-gray-700">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>{packageData.hotel}</span>
          </div>

          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Guide: {packageData.guide}</span>
          </div>

          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            <span>Climate: {packageData.climate}</span>
          </div>

          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Area: {packageData.area}</span>
          </div>
          
          {/* Weather Info */}
          {hasWeatherData && (
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <span className="text-blue-600">
                  Weather: {weatherData[packageData.area].temperature} • {weatherData[packageData.area].rainfall}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Button */}
        <Link
          to={`/packages/${packageData._id}`}
          className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

// Filter Component
const FilterSection = ({ filters, setFilters, uniqueClimates, uniqueAreas, weatherData, highlightWeatherArea }) => {
  const priceRanges = [
    { min: 0, max: 50, label: "Under $50" },
    { min: 50, max: 100, label: "$50 - $100" },
    { min: 100, max: 200, label: "$100 - $200" },
    { min: 200, max: 500, label: "$200 - $500" },
    { min: 500, max: Infinity, label: "Over $500" }
  ];

  // Handle price range selection
  const handlePriceChange = (min, max) => {
    setFilters(prev => ({
      ...prev,
      price: { min, max }
    }));
  };

  // Handle climate selection
  const handleClimateChange = (climate) => {
    setFilters(prev => ({
      ...prev,
      climate: prev.climate === climate ? '' : climate
    }));
  };

  // Handle area selection
  const handleAreaChange = (area) => {
    setFilters(prev => ({
      ...prev,
      area: prev.area === area ? '' : area
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      price: { min: 0, max: Infinity },
      climate: '',
      area: '',
      weather: filters.weather // Preserve weather filter
    });
  };

  // Handle weather condition filter
  const handleWeatherFilter = (condition) => {
    setFilters(prev => ({
      ...prev,
      weather: prev.weather === condition ? '' : condition
    }));
  };

  // Get areas with checked weather
  const areasWithWeather = Object.keys(weatherData || {});

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6 mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Filters</h2>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
        >
          Reset All
        </button>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Price Range</h3>
        <div className="space-y-2">
          {priceRanges.map((range, index) => (
            <div key={index} className="flex items-center">
              <input
                type="radio"
                id={`price-${index}`}
                checked={filters.price.min === range.min && filters.price.max === range.max}
                onChange={() => handlePriceChange(range.min, range.max)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={`price-${index}`} className="ml-2 text-gray-700">
                {range.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Climate Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Climate</h3>
        <div className="flex flex-wrap gap-2">
          {uniqueClimates.map((climate, index) => (
            <button
              key={index}
              onClick={() => handleClimateChange(climate)}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.climate === climate
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {climate}
            </button>
          ))}
        </div>
      </div>

      {/* Area Filter */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Area</h3>
        <div className="flex flex-wrap gap-2">
          {uniqueAreas.map((area, index) => (
            <button
              key={index}
              onClick={() => handleAreaChange(area)}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.area === area
                  ? 'bg-blue-600 text-white'
                  : areasWithWeather.includes(area) && area === highlightWeatherArea
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {area}
              {areasWithWeather.includes(area) && (
                <span className="ml-1">🌤️</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Weather Condition Filter - Only show if we have weather data */}
      {/* {Object.keys(weatherData || {}).length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Weather Condition</h3>
          <div className="flex flex-wrap gap-2">
            {['Sunny', 'Cloudy', 'Rainy', 'Clear'].map((condition, index) => (
              <button
                key={index}
                onClick={() => handleWeatherFilter(condition)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.weather === condition
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {condition}
              </button>
            ))}
          </div>
        </div>
      )} */}
    </motion.div>
  );
};

// All Packages Component
const AllPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [uniqueClimates, setUniqueClimates] = useState([]);
  const [uniqueAreas, setUniqueAreas] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [selectedWeatherArea, setSelectedWeatherArea] = useState('');
  const [filters, setFilters] = useState({
    price: { min: 0, max: Infinity },
    climate: '',
    area: '',
    weather: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:3000/packages');
        setPackages(response.data);
        setFilteredPackages(response.data);
        
        // Extract unique climates and areas
        const climates = [...new Set(response.data.map(pkg => pkg.climate))];
        const areas = [...new Set(response.data.map(pkg => pkg.area))];
        
        setUniqueClimates(climates);
        setUniqueAreas(areas);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch packages');
        setLoading(false);
        console.error('Error fetching packages:', err);
      }
    };

    fetchPackages();
  }, []);

  // Apply filters
  useEffect(() => {
    const filtered = packages.filter(pkg => {
      // Price filter
      const priceMatch = pkg.pricePerPerson >= filters.price.min && pkg.pricePerPerson <= filters.price.max;
      
      // Climate filter
      const climateMatch = !filters.climate || pkg.climate === filters.climate;
      
      // Area filter
      const areaMatch = !filters.area || pkg.area === filters.area;
      
      // Weather filter - only apply if we have weather data for this area
      // let weatherMatch = true;
      // if (filters.weather && weatherData[pkg.area]) {
      //   weatherMatch = weatherData[pkg.area].conditions.toLowerCase().includes(filters.weather.toLowerCase());
      // }
      
      return priceMatch && climateMatch && areaMatch ;
    });
    
    setFilteredPackages(filtered);
  }, [filters, packages, weatherData]);

  // Handle weather data updates
  const handleWeatherUpdate = (newWeatherData) => {
    setWeatherData(newWeatherData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="mb-8 flex flex-col md:flex-row justify-between items-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Travel Packages</h1>
          
          <div className="w-full md:w-auto">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="w-full md:w-auto flex items-center justify-center bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-4 md:mb-0"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter section - visible on larger screens or when toggled */}
          {showFilters && (
            <div className="w-full lg:w-1/4">
              {/* Weather Prediction Component */}
              <WeatherPredictionFilter 
                onWeatherUpdate={handleWeatherUpdate} 
                areas={uniqueAreas}
                setSelectedWeatherArea={setSelectedWeatherArea}
              />
              
              {/* Regular Filters */}
              <FilterSection 
                filters={filters} 
                setFilters={setFilters} 
                uniqueClimates={uniqueClimates}
                uniqueAreas={uniqueAreas}
                weatherData={weatherData}
                highlightWeatherArea={selectedWeatherArea}
              />
            </div>
          )}
          
          {/* Packages grid */}
          <div className={`w-full ${showFilters ? 'lg:w-3/4' : 'w-full'}`}>
            {filteredPackages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPackages.map((pkg) => (
                  <PackageCard 
                    key={pkg._id} 
                    packageData={pkg} 
                    weatherData={weatherData}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-400 text-yellow-800 p-6 rounded-md text-center">
                <h3 className="text-lg font-semibold mb-2">No packages found</h3>
                <p>Try adjusting your filters to see more results.</p>
                <button 
                  onClick={() => setFilters({
                    price: { min: 0, max: Infinity },
                    climate: '',
                    area: '',
                    weather: ''
                  })}
                  className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllPackages;