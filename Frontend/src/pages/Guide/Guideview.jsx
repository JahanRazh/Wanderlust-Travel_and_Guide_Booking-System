import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Guideview = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await axios.get('http://localhost:3000/getguide');
        console.log('Guide data:', response.data); // Debug log
        setGuides(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch guides');
        setLoading(false);
        console.error('Error fetching guides:', err);
      }
    };

    fetchGuides();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
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
    <div className="container mx-auto px-4 py-8">
      {/* Header Section with Join Button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Our Professional Guides</h1>
        <Link
          to="/guideform"
          className="bg-amber-600 text-white px-6 py-3 rounded-md hover:bg-amber-700 transition-colors duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1"
        >
          Join as a Guide
        </Link>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {guides.map((guide) => (
          <motion.div
            key={guide._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Guide Image */}
            <div className="relative h-48">
              {guide.profilePic ? (
                <img
                  src={`http://localhost:3000/uploads/${guide.profilePic}`}
                  alt={guide.fullname}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log('Image load error:', e); // Debug log
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              {/* Experience Badge */}
              <div className="absolute top-2 right-2">
                <div className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  {guide.experience || guide.workExperience} years
                </div>
              </div>
            </div>

            {/* Guide Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{guide.fullname}</h3>
              
              <div className="space-y-3 mb-6 text-gray-700">
                {/* Contact Number */}
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-amber-600" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm">{guide.contactNumber || guide.phoneNumber}</span>
                </div>

                {/* Email */}
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-amber-600" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">{guide.email}</span>
                </div>

                {/* Location */}
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-amber-600" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm">{guide.address || guide.location}</span>
                </div>

                {/* Experience */}
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-amber-600" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">{guide.experience || guide.workExperience} years of experience</span>
                </div>
              </div>

              {/* Contact Button */}
              <button
                onClick={() => window.location.href = `mailto:${guide.email}`}
                className="block w-full text-center bg-amber-600 text-white py-3 px-4 rounded-md hover:bg-amber-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 font-medium shadow-md flex items-center justify-center"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Guide
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Guideview;
