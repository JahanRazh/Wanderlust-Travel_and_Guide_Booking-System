import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const BACKEND_URL = "http://localhost:3000"; // or from env

const getImageUrl = (imgPath) => 
  imgPath.startsWith('http') ? imgPath : `${BACKEND_URL}${imgPath}`;


const PackageDetails = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  
  const [packageData, setPackageData] = useState(null);
  const [similarPackages, setSimilarPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 7)));
  const [travelers, setTravelers] = useState(1);
  const [addedToWishlist, setAddedToWishlist] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  
  // Weather forecast states
  const [weatherResult, setWeatherResult] = useState(null);
  const [weatherError, setWeatherError] = useState('');
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [selectedWeatherDate, setSelectedWeatherDate] = useState('');
  
  // User information states
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  
  // Check authentication status and get user data when component mounts
  useEffect(() => {
    const updateUserDetails = (userData) => {
      if (userData) {
        setUserName(userData.fullName || '');
        setUserEmail(userData.email || '');
        setIsAuthenticated(true);
        setLoggedInUser(userData);
      }
    };

    // Initial load of user data
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user'));
      updateUserDetails(userData);
    }

    // Listen for changes in localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        const updatedUserData = JSON.parse(e.newValue);
        updateUserDetails(updatedUserData);
      }
    };

    // Listen for custom event for profile updates
    const handleProfileUpdate = (e) => {
      const updatedUserData = e.detail;
      updateUserDetails(updatedUserData);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/packages/${packageId}`);
        setPackageData(response.data);
        setLoading(false);
        
        // After getting package data, fetch similar packages
        fetchSimilarPackages(response.data);
      } catch (err) {
        setError('Failed to fetch package details');
        setLoading(false);
        console.error('Error fetching package details:', err);
      }
    };

    fetchPackageDetails();
    // Scroll to top when component mounts or packageId changes
    window.scrollTo(0, 0);
  }, [packageId]);

  // Function to fetch similar packages
  const fetchSimilarPackages = async (currentPackage) => {
    if (!currentPackage) return;
    
    try {
      // Use the API endpoint to get similar packages directly
      const response = await axios.get(`http://localhost:3000/packages/${currentPackage._id}/similar/50`);
      setSimilarPackages(response.data);
    } catch (err) {
      console.error('Error fetching similar packages:', err);
    }
  };

  // Functions for image carousel
  const nextImage = () => {
    if (packageData?.images && packageData.images.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === packageData.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (packageData?.images && packageData.images.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? packageData.images.length - 1 : prevIndex - 1
      );
    }
  };

  // Function to calculate total price
  const calculateTotalPrice = () => {
    if (!packageData) return 0;
    
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    return packageData.pricePerPerson * travelers * daysDiff;
  };

  // Function to handle wishlist
  const toggleWishlist = () => {
    // In a real application, this would call an API to save to user's wishlist
    setAddedToWishlist(!addedToWishlist);
  };

  // Function to handle booking
  const handleBooking = async () => {
    try {
      // Validate user information
      if (!userName || !userEmail) {
        alert('Please fill in all your information to proceed with booking');
        return;
      }

      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem('user'));
      
      const bookingData = {
        userName,
        userEmail,
        userPhone: userData?.phoneNumber || '', // Make phone optional
        packageId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalBudget: calculateTotalPrice(),
        numberOfPeople: travelers
      };

      console.log('Sending booking data:', bookingData);

      const response = await axios.post(`${BACKEND_URL}/bookings`, bookingData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 201) {
        alert('Booking successful! We will contact you shortly with more details.');
        // Reset form
        setUserName('');
        setUserEmail('');
        setTravelers(1);
        setStartDate(new Date());
        setEndDate(new Date(new Date().setDate(new Date().getDate() + 7)));
      }
    } catch (error) {
      console.error('Booking failed:', error);
      alert(error.response?.data?.message || 'Failed to create booking. Please try again.');
    }
  };

  // Navigate to another package
  const handlePackageClick = (id) => {
    navigate(`/packages/${id}`);
    window.scrollTo(0, 0); // Scroll back to top
  };

  // Weather forecast functions
  const validateCity = (cityName) => {
    if (!/^[A-Z]/.test(cityName)) {
      setWeatherError('City name must start with a capital letter');
      return false;
    }
    return true;
  };

  const handleWeatherForecast = async (e) => {
    e.preventDefault();
    
    if (!packageData) return;
    
    const city = packageData.area.split(',')[0].trim(); // Assuming first part is the city
    
    if (!validateCity(city) || !selectedWeatherDate) {
      return;
    }
    
    setWeatherError('');
    setWeatherResult(null);
    setIsWeatherLoading(true);

    try {
      const res = await axios.post('http://localhost:3000/predict', { 
        city: city, 
        date: selectedWeatherDate 
      });
      setWeatherResult(res.data);
    } catch (err) {
      setWeatherError(err.response?.data?.error || 'Failed to get weather forecast');
    } finally {
      setIsWeatherLoading(false);
    }
  };

  // Format date for the weather input
  const formatDateForWeather = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Initialize weather date when package data loads
  useEffect(() => {
    if (packageData && startDate) {
      setSelectedWeatherDate(formatDateForWeather(startDate));
    }
  }, [packageData, startDate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error || 'Package not found'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3"> 
          <li>
            <div className="flex items-center">
              <button 
                onClick={() => navigate('../view/TravelPackages')} 
                className="ml-1 text-gray-700 hover:text-blue-600 md:ml-2"
              >
                Packages
              </button>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="ml-1 text-gray-500 md:ml-2">{packageData.packageName}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Package Images and Details */}
        <div className="lg:w-7/12">
          {/* Image Carousel */}
          <div className="relative h-96 rounded-lg overflow-hidden mb-6">
            {packageData.images && packageData.images.length > 0 ? (
              <>
                <img 
                  src={getImageUrl(packageData.images[currentImageIndex])} 
                  alt={packageData.packageName} 
                  className="w-full h-full object-cover"
                />
                {packageData.images.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-4">
                    <button 
                      onClick={prevImage}
                      className="bg-black bg-opacity-40 text-white rounded-full p-2 hover:bg-opacity-60 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button 
                      onClick={nextImage}
                      className="bg-black bg-opacity-40 text-white rounded-full p-2 hover:bg-opacity-60 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
                {/* Image indicator */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {packageData.images.map((_, index) => (
                    <button 
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 w-2 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Package Details */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{packageData.packageName}</h1>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <div className="flex justify-between">
                <div className="text-blue-700">Base Price: <span className="font-bold">${packageData.pricePerPerson}</span> per person</div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
                <p className="text-gray-600">{packageData.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Details</h2>
                  <ul className="space-y-2">
                  <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <span><strong>Area:</strong> {packageData.area}</span>
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span><strong>Hotel:</strong> {packageData.hotel}</span>
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span><strong>Guide:</strong> {packageData.guide}</span>
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                      <span><strong>Climate:</strong> {packageData.climate}</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Highlights</h2>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Professional local guides</li>
                    <li>Quality accommodations</li>
                    <li>All-inclusive experience</li>
                    <li>24/7 customer support</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Weather Forecast Component */}
            <div className="mt-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
                  Check {packageData.area.split(',')[0]} Weather Forecast
                </h2>
                <form onSubmit={handleWeatherForecast} className="space-y-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Select Date
                    </label>
                    <input
                      id="date"
                      type="date"
                      value={selectedWeatherDate}
                      onChange={(e) => setSelectedWeatherDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      required
                      min={formatDateForWeather(new Date())}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isWeatherLoading}
                    className={`w-full py-2 px-4 rounded-lg font-medium text-white transition-colors ${
                      isWeatherLoading 
                        ? 'bg-indigo-400 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    {isWeatherLoading ? 'Loading...' : 'Get Forecast'}
                  </button>
                </form>

                {weatherError && (
                  <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                    <p>{weatherError}</p>
                  </div>
                )}

                {weatherResult && (
                  <div className="mt-6 p-5 bg-white rounded-lg shadow-md border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      {weatherResult.city} <span className="text-gray-500">on</span> {weatherResult.date}
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">🌡️</span>
                        <div>
                          <p className="text-sm text-gray-500">Temperature</p>
                          <p className="font-medium text-indigo-600">{weatherResult.temperature}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">🌧️</span>
                        <div>
                          <p className="text-sm text-gray-500">Rainfall</p>
                          <p className="font-medium text-blue-600">{weatherResult.rainfall}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">🌤️</span>
                        <div>
                          <p className="text-sm text-gray-500">Conditions</p>
                          <p className="font-medium text-green-600">{weatherResult.conditions}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Booking Form */}
        <div className="lg:w-5/12">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Book This Package</h2>
            
            <div className="space-y-4 mb-6">
              {/* User Information */}
              <div>
                <label className="block text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter your full name"
                  required
                  disabled={isAuthenticated}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter your email"
                  required
                  disabled={isAuthenticated}
                />
              </div>

              {/* Existing date and travelers inputs */}
              <div>
                <label className="block text-gray-700 mb-2">Start Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  minDate={new Date()}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">End Date</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Number of Travelers</label>
                <div className="flex items-center">
                  <button 
                    type="button"
                    onClick={() => setTravelers(prev => Math.max(1, prev - 1))}
                    className="p-2 border border-gray-300 rounded-l-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <div className="flex-1 py-2 text-center border-t border-b border-gray-300">{travelers}</div>
                  <button 
                    type="button"
                    onClick={() => setTravelers(prev => prev + 1)}
                    className="p-2 border border-gray-300 rounded-r-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="border-t border-b border-gray-200 py-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span>Base price:</span>
                <span>${packageData?.pricePerPerson} × {travelers}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>Duration:</span>
                <span>{Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))} days</span>
              </div>
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total:</span>
                <span>${calculateTotalPrice()}</span>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={toggleWishlist}
                className={`flex-1 py-3 px-4 flex justify-center items-center rounded-md border ${
                  addedToWishlist 
                    ? 'bg-red-50 text-red-600 border-red-200' 
                    : 'text-gray-600 hover:bg-gray-50 border-gray-300'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${addedToWishlist ? 'text-red-500' : 'text-gray-400'}`} fill={addedToWishlist ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {addedToWishlist ? 'Saved' : 'Wishlist'}
              </button>
              
              <button
                type="button"
                onClick={handleBooking}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Packages Section */}
      {similarPackages.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Similar Packages You May Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarPackages.map(pkg => (
              <div 
                key={pkg._id} 
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handlePackageClick(pkg._id)}
              >
                <div className="h-48 relative">
                  {pkg.images && pkg.images.length > 0 ? (
                    <img 
                      src={getImageUrl(pkg.images[0])} 
                      alt={pkg.packageName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <h3 className="text-white font-semibold">{pkg.packageName}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">{pkg.climate}</span>
                    <span className="font-bold text-blue-600">${pkg.pricePerPerson}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>{pkg.hotel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageDetails;



