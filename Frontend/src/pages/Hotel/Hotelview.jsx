import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/AllPackages.module.css';// Define your custom CSS
import Footer from '../../components/footer';
import axios from 'axios';

const Hotelview = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get('http://localhost:3000/hotels');
        console.log('Fetched hotels:', response.data); // Debug log
        setHotels(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError('Failed to fetch hotels. Please try again later.');
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const getHotelImage = (hotel) => {
    // Try to get the main photo first
    if (hotel.mainPhoto && hotel.mainPhoto.url) {
      return hotel.mainPhoto.url;
    }
    // Then try to get the first photo from the photos array
    if (hotel.photos && hotel.photos.length > 0 && hotel.photos[0].url) {
      return hotel.photos[0].url;
    }
    // Return placeholder if no photos are available
    return 'https://via.placeholder.com/300x200?text=Hotel+Image';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="center px-8 py-8">
        <h1 className="text-3xl font-bold text-center mb-10">Our Hotels</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-[-20]">
          {hotels.map((hotel) => (
            <div 
              key={hotel._id} 
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={getHotelImage(hotel)}
                  alt={hotel.name}
                  className="w-full h-full object-cover rounded-t-lg transition-transform duration-300 hover:scale-110"
                  onError={(e) => {
                    console.error('Image load error for hotel:', hotel.name);
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=Hotel+Image';
                  }}
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{hotel.name}</h2>
                <p className="text-gray-600 mb-2 line-clamp-2">{hotel.description}</p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {hotel.location}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {hotel.type}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    {hotel.no_of_rooms} Rooms
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ${hotel.price}/night
                  </p>
                </div>
                <Link 
                  to={`/hoteldetails/${hotel._id}`} 
                  className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Hotelview;