import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../components/footer';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/hotels/${id}`);
        setHotel(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching hotel details:', err);
        setError('Failed to fetch hotel details. Please try again later.');
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id]);

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

  if (!hotel) {
    return (
      <div className="text-center py-8">
        Hotel not found
      </div>
    );
  }

  const displayPhoto = hotel.photos && hotel.photos[selectedPhotoIndex]?.url || 
                      hotel.mainPhoto?.url || 
                      'https://via.placeholder.com/1200x400?text=Hotel+Image';

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        >
          ← Back to Hotels
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Main Photo */}
          <div className="relative h-96">
            <img
              src={displayPhoto}
              alt={hotel.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/1200x400?text=Hotel+Image';
              }}
            />
          </div>

          {/* Photo Thumbnails */}
          {hotel.photos && hotel.photos.length > 1 && (
            <div className="p-4 bg-gray-100">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {hotel.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPhotoIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                      selectedPhotoIndex === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={`${hotel.name} - Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">{hotel.name}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Hotel Information</h2>
                <div className="space-y-3">
                  <p><span className="font-semibold">Type:</span> {hotel.type}</p>
                  <p><span className="font-semibold">Location:</span> {hotel.location}</p>
                  <p><span className="font-semibold">Number of Rooms:</span> {hotel.no_of_rooms}</p>
                  <p><span className="font-semibold">Price per Night:</span> ${hotel.price}</p>
                  <p><span className="font-semibold">Email:</span> {hotel.email}</p>
                  <p><span className="font-semibold">Phone:</span> {hotel.pno}</p>
                  <p><span className="font-semibold">Check-in:</span> {hotel.checkIn}</p>
                  <p><span className="font-semibold">Check-out:</span> {hotel.checkOut}</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700 mb-6">{hotel.description}</p>

                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                    <div className="grid grid-cols-2 gap-2">
                      {hotel.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="text-green-500">✓</span>
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => navigate('/booking')}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HotelDetails; 