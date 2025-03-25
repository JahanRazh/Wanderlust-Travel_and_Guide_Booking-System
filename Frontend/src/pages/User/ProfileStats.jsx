import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from "../../utils/constants";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = BASE_URL;

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
    nic: '',
    address: '',
    bio: '',
    travelstyle: '',
    travelbudget: '',
    travelinterest: '',
    profileImage: null,
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    dateofBirth: '',
    gender: '',
    phoneNumber: '',
    nic: '',
    address: '',
    bio: '',
    profileImage: '',
  });

  const [tempImagePreview, setTempImagePreview] = useState(null);
  const navigate = useNavigate();
  const { userId } = useParams();

  // Validation functions
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (value.length > 50) {
          error = 'Full name must be less than 50 characters';
        }
        break;
      
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      
      case 'dateofBirth':
        if (value) {
          const dob = new Date(value);
          const today = new Date();
          if (dob >= today) {
            error = 'Date of birth must be in the past';
          }
        }
        break;
      
      case 'phoneNumber':
        if (value && !/^[0-9]{10}$/.test(value)) {
          error = 'Please enter a valid 10-digit phone number';
        }
        break;
      
      case 'nic':
        if (value && !/^([0-9]{9}[vVxX]|[0-9]{12})$/.test(value)) {
          error = 'Please enter a valid NIC (old or new format)';
        }
        break;
    }
    
    return error;
  };

  // Handle input changes with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate the field
    const error = validateField(name, value);
    
    setErrors({
      ...errors,
      [name]: error
    });
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file input changes with validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate the file
      const error = validateField('profileImage', file);
      
      setErrors({
        ...errors,
        profileImage: error
      });
      
      if (!error) {
        setFormData({
          ...formData,
          profileImage: file,
        });

        // Create a temporary preview of the image
        const reader = new FileReader();
        reader.onloadend = () => {
          setTempImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error(error);
      }
    }
  };

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
        const endpoint = `${API_BASE_URL}/get-user/${userId}`;
        const response = await axios.get(endpoint, {
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
          nic: response.data.user.nic,
          address: response.data.user.address,
          bio: response.data.user.bio,
          travelstyle: response.data.user.travelstyle,
          travelbudget: response.data.user.travelbudget,
          travelinterest: response.data.user.travelinterest,
          profileImage: response.data.user.profileImage,
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "An error occurred while fetching your profile.");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  // Validate entire form before submission
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate required fields
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Validate other fields
    if (formData.phoneNumber && !/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }

    if (formData.nic && !/^([0-9]{9}[vVxX]|[0-9]{12})$/.test(formData.nic)) {
      newErrors.nic = 'Please enter a valid NIC (old or new format)';
      isValid = false;
    }

    if (formData.dateofBirth) {
      const dob = new Date(formData.dateofBirth);
      const today = new Date();
      if (dob >= today) {
        newErrors.dateofBirth = 'Date of birth must be in the past';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form before submitting.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError("You are not authenticated. Please log in.");
      return;
    }

    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('email', formData.email);
    data.append('dateofBirth', formData.dateofBirth);
    data.append('gender', formData.gender);
    data.append('phoneNumber', formData.phoneNumber);
    data.append('nic', formData.nic);
    data.append('address', formData.address);
    data.append('bio', formData.bio);
    data.append('travelstyle', formData.travelstyle);
    data.append('travelbudget', formData.travelbudget);
    data.append('travelinterest', formData.travelinterest);
    if (formData.profileImage && typeof formData.profileImage !== 'string') {
      data.append('profileImage', formData.profileImage);
    }

    // Include targetUserId if admin is updating another user
    if (userId) {
      data.append('targetUserId', userId);
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/user/update-profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser(response.data.user);
      setTempImagePreview(null);
      toast.success('Profile updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred while updating your profile.");
      toast.error(err.response?.data?.message || 'Failed to update profile.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  return (
    <div className="w-full md:w-3/4 p-4 md:p-10 bg-white rounded-lg shadow-lg z-50 mx-auto mt-4 md:mt-10 mb-10">
      <h2 className="text-2xl font-semibold mb-4">Profile Statistics</h2>
      
      {/* Profile Image Section */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-cyan-500">
          {tempImagePreview ? (
            <img
              src={tempImagePreview}
              alt="Profile Preview"
              className="w-full h-full object-cover"
            />
          ) : user.profileImage ? (
            <img
              src={`${API_BASE_URL}/${user.profileImage}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>
        <label className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition cursor-pointer">
          Upload Photo
          <input
            type="file"
            name="profileImage"
            onChange={handleFileChange}
            accept="image/jpeg, image/png, image/gif"
            className="hidden"
          />
        </label>
        {errors.profileImage && (
          <p className="text-red-500 text-sm mt-1">{errors.profileImage}</p>
        )}
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <div className="col-span-2">
            <h3 className="text-xl font-medium mb-3">Basic Information</h3>
          </div>
          
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full p-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500`}
              required
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dateofBirth"
              value={formData.dateofBirth}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full p-2 border ${errors.dateofBirth ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500`}
            />
            {errors.dateofBirth && (
              <p className="text-red-500 text-sm mt-1">{errors.dateofBirth}</p>
            )}
          </div>
          
          {/* Gender */}
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
          
          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="10 digits without spaces"
              className={`w-full p-2 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500`}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>
          
          {/* NIC */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIC</label>
            <input
              type="text"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              placeholder="Old (9 digits + V/X) or new (12 digits)"
              className={`w-full p-2 border ${errors.nic ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500`}
            />
            {errors.nic && (
              <p className="text-red-500 text-sm mt-1">{errors.nic}</p>
            )}
          </div>
          
          {/* Address */}
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
          
          {/* Bio */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="2"
              maxLength="200"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Tell us about yourself (max 200 characters)"
            />
           
          </div>
          
          {/* Travel Preferences */}
          <div className="col-span-2 mt-4">
            <h3 className="text-xl font-medium mb-3">Travel Preferences</h3>
          </div>
          
          {/* Travel Style */}
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
          
          {/* Travel Budget */}
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
          
          {/* Travel Interest */}
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
            className="px-6 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition disabled:opacity-50"
            disabled={Object.values(errors).some(error => error)}
          >
            Update Profile
          </button>
        </div>
      </form>

      {/* Admin Dashboard Button (Conditional Rendering) */}
      {user?.role === 'admin' && (
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition mr-4"
          onClick={() => navigate("/admindashboard")}
        >
          Admin Dashboard
        </button>
      )}
      
      {/* Back to Dashboard Button */}
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={() => navigate("/home")}
      >
        Back to Home
      </button>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default ProfileStats;