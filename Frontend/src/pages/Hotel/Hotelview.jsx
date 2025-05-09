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
          <div key={hotel._id} className={styles.hotelcard}>
            <div className="relative h-48 overflow-hidden">
              <img
                src={getHotelImage(hotel)}
                alt={hotel.name}
                className="w-full h-full object-cover rounded-t-lg transition-transform duration-300 hover:scale-110"
                onError={(e) => {
                  console.error('Image load error for hotel:', hotel.name); // Debug log
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x200?text=Hotel+Image';
                }}
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{hotel.name}</h2>
              <p className="text-gray-600 mb-2 line-clamp-2">{hotel.description}</p>
              <p className="text-sm text-gray-500 mb-2">Location: {hotel.location}</p>
              <p className="text-sm text-gray-500 mb-2">Type: {hotel.type}</p>
              <p className="text-sm text-gray-500 mb-2">Rooms: {hotel.no_of_rooms}</p>
              <p className="text-sm text-gray-500 mb-2">Price: ${hotel.price}/night</p>
              <Link 
                to={`/hoteldetails/${hotel._id}`} 
                className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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