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
  const [hotels, setHotels] = useState([]);
  const [guides, setGuides] = useState([]);
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
  const [userPhone, setUserPhone] = useState('');
  
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
    const fetchData = async () => {
      try {
        const [packageRes, hotelsRes, guidesRes] = await Promise.all([
          axios.get(`http://localhost:3000/packages/${packageId}`),
          axios.get('http://localhost:3000/hotels'),
          axios.get('http://localhost:3000/getguide')
        ]);

        setPackageData(packageRes.data);
        setHotels(hotelsRes.data);
        setGuides(guidesRes.data);
        setLoading(false);
        
        // After getting package data, fetch similar packages
        fetchSimilarPackages(packageRes.data);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
    // Scroll to top when component mounts or packageId changes
    window.scrollTo(0, 0);
  }, [packageId]);

  const getHotelName = (hotelId) => {
    const hotel = hotels.find(h => h._id === hotelId);
    return hotel ? hotel.name : 'Unknown Hotel';
  };

  const getGuideName = (guideId) => {
    const guide = guides.find(g => g._id === guideId);
    return guide ? guide.fullname : 'Unknown Guide';
  };

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
      {/* New Navigation Breadcrumb Design */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm">
          <button 
            onClick={() => navigate('../view/TravelPackages')} 
            className="flex items-center text-gray-500 hover:text-blue-600 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </button>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <button 
            onClick={() => navigate('../view/TravelPackages')} 
            className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
          >
            Packages
          </button>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <div className="flex items-center">
            <span className="text-blue-600 font-medium">{packageData.packageName}</span>
            <div className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
              Active
            </div>
          </div>
        </div>
      </div>

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
          <div className="space-y-8">
            {/* Package Description */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About This Package
              </h2>
              <p className="text-gray-600 leading-relaxed">{packageData.description}</p>
            </div>

            {/* Weather Forecast Component */}
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-800 to-blue-900 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                  Weather Forecast for {packageData.area.split(',')[0]}
                </h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleWeatherForecast} className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Select Date
                    </label>
                    <input
                      id="date"
                      type="date"
                      value={selectedWeatherDate}
                      onChange={(e) => setSelectedWeatherDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-blue-800 transition"
                      required
                      min={formatDateForWeather(new Date())}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isWeatherLoading}
                    className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-200 flex items-center justify-center ${
                      isWeatherLoading 
                        ? 'bg-blue-700 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 transform hover:scale-[1.02]'
                    }`}
                  >
                    {isWeatherLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                        Get Forecast
                      </>
                    )}
                  </button>
                </form>

                {weatherError && (
                  <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-700">{weatherError}</p>
                    </div>
                  </div>
                )}

                {weatherResult && (
                  <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {weatherResult.city}
                      </h3>
                      <span className="text-sm text-gray-500">{weatherResult.date}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-100 rounded-xl p-4 flex items-center">
                        <span className="text-3xl mr-3">🌡️</span>
                        <div>
                          <p className="text-sm text-gray-500">Temperature</p>
                          <p className="text-lg font-semibold text-blue-800">{weatherResult.temperature}</p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-100 rounded-xl p-4 flex items-center">
                        <span className="text-3xl mr-3">🌧️</span>
                        <div>
                          <p className="text-sm text-gray-500">Rainfall</p>
                          <p className="text-lg font-semibold text-blue-800">{weatherResult.rainfall}</p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-100 rounded-xl p-4 flex items-center">
                        <span className="text-3xl mr-3">🌤️</span>
                        <div>
                          <p className="text-sm text-gray-500">Conditions</p>
                          <p className="text-lg font-semibold text-blue-800">{weatherResult.conditions}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Package Details and Highlights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Package Details */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Package Details
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02]">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-500 mb-1">Location</span>
                        <span className="text-lg font-semibold text-gray-800">{packageData.area}</span>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02]">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-500 mb-1">Accommodation</span>
                        <span className="text-lg font-semibold text-gray-800">{getHotelName(packageData.hotel)}</span>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02]">
                      <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-500 mb-1">Local Guide</span>
                        <span className="text-lg font-semibold text-gray-800">{getGuideName(packageData.guide)}</span>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02]">
                      <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-500 mb-1">Climate</span>
                        <span className="text-lg font-semibold text-gray-800">{packageData.climate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Package Highlights */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Package Highlights
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02]">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">Professional Guides</span>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02]">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">Quality Stays</span>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02]">
                      <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">All-Inclusive</span>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02]">
                      <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">24/7 Support</span>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02]">
                      <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">Flexible Booking</span>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02]">
                      <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">Best Price</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Booking Form */}
        <div className="lg:w-5/12">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Book This Package
            </h2>
            
            <div className="space-y-6 mb-6">
              {/* User Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Enter your full name"
                      required
                      disabled={isAuthenticated}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Enter your email"
                      required
                      disabled={isAuthenticated}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Travel Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Travel Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Start Date
                    </label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      minDate={new Date()}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      dateFormat="MMMM d, yyyy"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      End Date
                    </label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      dateFormat="MMMM d, yyyy"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Number of Travelers
                    </label>
                    <div className="flex items-center">
                      <button 
                        type="button"
                        onClick={() => setTravelers(prev => Math.max(1, prev - 1))}
                        className="p-3 border border-gray-300 rounded-l-lg hover:bg-gray-100 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <div className="flex-1 py-3 text-center border-t border-b border-gray-300 bg-white">{travelers}</div>
                      <button 
                        type="button"
                        onClick={() => setTravelers(prev => prev + 1)}
                        className="p-3 border border-gray-300 rounded-r-lg hover:bg-gray-100 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Price Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-gray-700">
                  <span>Base price per person:</span>
                  <span>${packageData?.pricePerPerson}</span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span>Number of travelers:</span>
                  <span>{travelers}</span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span>Duration:</span>
                  <span>{Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))} days</span>
                </div>
                <div className="border-t border-blue-200 pt-3 mt-3">
                  <div className="flex justify-between items-center font-bold text-lg text-blue-900">
                    <span>Total Price:</span>
                    <span>${calculateTotalPrice()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={toggleWishlist}
                className={`flex-1 py-3 px-4 flex justify-center items-center rounded-lg border transition-all duration-200 ${
                  addedToWishlist 
                    ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
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
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
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
                    <span>{getHotelName(pkg.hotel)}</span>
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



