import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { BASE_URL } from "../../utils/constants"  // Import the base URL for the API requests.
const API_BASE_URL = BASE_URL; // or Replace with your backend URL http://localhost:3000
const ProfileStats = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    dateofBirth: '',
    gender: '',
    phoneNumber: '',
    address: '',
    bio: '',
    travelstyle: '',
    travelbudget: '',
    travelinterest: ''
  });

  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("You are not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/get-user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
        setFormData({
          fullName: response.data.user.fullName,
          email: response.data.user.email,
          dateofBirth: response.data.user.dateofBirth ? new Date(response.data.user.dateofBirth).toISOString().split('T')[0] : '',
          gender: response.data.user.gender,
          phoneNumber: response.data.user.phoneNumber,
          address: response.data.user.address,
          bio: response.data.user.bio,
          travelstyle: response.data.user.travelstyle,
          travelbudget: response.data.user.travelbudget,
          travelinterest: response.data.user.travelinterest
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "An error occurred while fetching your profile.");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Redirect to dashboard if no user data is available
  if (!user) {
    navigate("/dashboard");
    return null;
  }

  // Check if the user is an admin (this should ideally come from the backend)
  const isAdmin = user.email === "admin@wanderlust.com";

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.fullName || !formData.email) {
      setError("Full Name and Email are required.");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError("You are not authenticated. Please log in.");
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/user/update-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.user);
      alert('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred while updating your profile.");
      alert('Failed to update profile.');
    }
  };

  // Display loading state
  if (loading) return <div>Loading...</div>;

  // Display error state
  if (error) return <div>Error: {error}</div>;

  // Render the form
  return (
    <div className="w-3/4 p-10 bg-white rounded-lg shadow-lg z-50 mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Profile Statistics</h2>
      
      {/* Profile Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <div className="col-span-2">
            <h3 className="text-xl font-medium mb-3">Basic Information</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dateofBirth"
              value={formData.dateofBirth}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="2"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="2"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          {/* Travel Preferences */}
          <div className="col-span-2 mt-4">
            <h3 className="text-xl font-medium mb-3">Travel Preferences</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Travel Style</label>
            <select
              name="travelstyle"
              value={formData.travelstyle}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Select Travel Style</option>
              <option value="adventure">Adventure</option>
              <option value="cultural">Cultural</option>
              <option value="relaxation">Relaxation</option>
              <option value="family">Family</option>
              <option value="solo">Solo</option>
              <option value="group">Group</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Travel Budget</label>
            <select
              name="travelbudget"
              value={formData.travelbudget}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Select Budget Range</option>
              <option value="economy">Economy</option>
              <option value="moderate">Moderate</option>
              <option value="premium">Premium</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Travel Interest</label>
            <select
              name="travelinterest"
              value={formData.travelinterest}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Select Travel Interest</option>
              <option value="Beaches">Beaches</option>
              <option value="Mountains">Mountains</option>
              <option value="Hiking">Hiking</option>
              <option value="Food Tours">Food Tours</option>
              <option value="Museums">Museums</option>
              <option value="Historical Sites">Historical Sites</option>
              <option value="Camping">Camping</option>
              <option value="City Tours">City Tours</option>
              <option value="Wildlife">Wildlife</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="mt-6 text-right">
          <button
            type="submit"
            className="px-6 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition"
          >
            Update Profile
          </button>
        </div>
      </form>

       {/* Admin Dashboard Button (Conditional Rendering) */}
      {isAdmin && (
        <button
          className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition mr-4"
          onClick={() => navigate("/admindashboard")} // Use absolute path
        >
          Admin Dashboard
        </button>
      )}
      
      {/* Back to Dashboard Button */}
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default ProfileStats;