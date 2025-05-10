import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateGuide = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    age: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    email: '',
    address: '',
    about: '',
    workExperience: '',
    profilePic: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]{10,15}$/;
    return re.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If age is being changed, calculate and set the date of birth
    if (name === 'age') {
      const age = parseInt(value);
      if (!isNaN(age) && age >= 18 && age <= 100) {
        const today = new Date();
        const birthYear = today.getFullYear() - age;
        const birthDate = new Date(birthYear, today.getMonth(), today.getDate());
        const formattedDate = birthDate.toISOString().split('T')[0];
        
        setFormData(prev => ({
          ...prev,
          age: value,
          dateOfBirth: formattedDate
        }));
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add a new handler for date of birth changes
  const handleDateChange = (e) => {
    const { value } = e.target;
    const birthDate = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    // Adjust age if birthday hasn't occurred this year
    // const monthDiff = today.getMonth() - birthDate.getMonth();
    // if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    //   age--;
    // }
    
    setFormData(prev => ({
      ...prev,
      dateOfBirth: value,
      age: age.toString()
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      setError('File size must be less than 2MB');
      return;
    }
    setFormData(prev => ({
      ...prev,
      profilePic: file
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    // Validation
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    if (!validatePhone(formData.contactNumber)) {
      setError('Please enter a valid phone number (10-15 digits)');
      setIsSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      for (const key in formData) {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      }

      const response = await axios.post('http://localhost:3000/createguide', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.message === 'Profile created successfully!') {
        setSuccess('Guide profile created successfully!');
        // Navigate to the guide profile page
        navigate('/guideprofile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating guide profile');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Create Guide Profile</h1>
            
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">{success}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="fullname">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                {/* Age */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="age">
                    Age *
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="18"
                    max="100"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                {/* Date of Birth */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="dateOfBirth">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleDateChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                {/* Gender */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="gender">
                    Gender *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Contact Number */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="contactNumber">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                {/* Address */}
                <div className="mb-4 md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="address">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                {/* About */}
                <div className="mb-4 md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="about">
                    About *
                  </label>
                  <textarea
                    id="about"
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                {/* Work Experience */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="workExperience">
                    Work Experience (years) *
                  </label>
                  <input
                    type="number"
                    id="workExperience"
                    name="workExperience"
                    value={formData.workExperience}
                    onChange={handleChange}
                    min="0"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                {/* Profile Picture */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="profilePic">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    id="profilePic"
                    name="profilePic"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 rounded-lg text-white font-medium text-lg transition-colors duration-200 ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-amber-500 hover:bg-amber-600 shadow-md hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? 'Creating...' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGuide;