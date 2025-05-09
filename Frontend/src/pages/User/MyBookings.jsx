import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCalendarAlt, FaUsers, FaMoneyBillWave, FaClock, FaTimes, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';

const BACKEND_URL = "http://localhost:3000";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));

      if (!token || !userData) {
        toast.error('Please login to view your bookings');
        navigate('/login');
        return;
      }

      console.log('Fetching bookings for user email:', userData.email); // Debug log

      // First, get all bookings
      const response = await axios.get(`${BACKEND_URL}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('All bookings response:', response.data); // Debug log

      if (response.data && Array.isArray(response.data)) {
        // Filter bookings by user's email
        const userBookings = response.data.filter(booking => 
          booking.userEmail.toLowerCase() === userData.email.toLowerCase()
        );
        
        console.log('Filtered user bookings:', userBookings); // Debug log
        
        setBookings(userBookings);
        setError(null);
      } else {
        console.error('Invalid data format received:', response.data);
        setError('No booking data available');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else if (err.response?.status === 404) {
        setError('No bookings found');
      } else {
        setError('Failed to fetch your bookings. Please try again later.');
      }
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${BACKEND_URL}/bookings/${bookingId}/status`,
        { status: 'cancelled' },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        toast.success('Booking cancelled successfully');
        setBookings(prevBookings =>
          prevBookings.map(booking =>
            booking._id === bookingId
              ? { ...booking, status: 'cancelled' }
              : booking
          )
        );
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      toast.error('Failed to cancel booking. Please try again.');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button
            onClick={fetchUserBookings}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">My Bookings</h1>
        
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Bookings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Package Image */}
                <div className="relative h-48">
                  {booking.packageId?.images?.[0] ? (
                    <img
                      src={`${BACKEND_URL}${booking.packageId.images[0]}`}
                      alt={booking.packageName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Package Details */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{booking.packageName}</h3>
                  
                  {/* User Details */}
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FaUser className="mr-2" />
                      <span>{booking.userName}</span>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="mr-2" />
                      <span>{booking.userEmail}</span>
                    </div>
                    {booking.userPhone && (
                      <div className="flex items-center">
                        <FaPhone className="mr-2" />
                        <span>{booking.userPhone}</span>
                      </div>
                    )}
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center text-gray-600">
                      <FaCalendarAlt className="mr-2" />
                      <span>Start: {new Date(booking.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaCalendarAlt className="mr-2" />
                      <span>End: {new Date(booking.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaUsers className="mr-2" />
                      <span>{booking.numberOfPeople} People</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaMoneyBillWave className="mr-2" />
                      <span>Total: ${booking.totalBudget}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <FaClock className="mr-2" />
                      <span>Booked on: {new Date(booking.bookingDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      <FaTimes className="mr-2" />
                      Cancel Booking
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No bookings found</p>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default MyBookings;
