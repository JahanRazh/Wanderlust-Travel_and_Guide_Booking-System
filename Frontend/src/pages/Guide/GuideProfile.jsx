import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GuideProfile = () => {
  const navigate = useNavigate();
  const [guide, setGuide] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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
  const [previewImage, setPreviewImage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchGuideProfile();
  }, []);

  const fetchGuideProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3000/getguide');
      if (response.data && response.data.length > 0) {
        const guideData = response.data[0];
        setGuide(guideData);
        setFormData({
          fullname: guideData.fullname,
          age: guideData.age,
          dateOfBirth: new Date(guideData.dateOfBirth).toISOString().split('T')[0],
          gender: guideData.gender,
          contactNumber: guideData.contactNumber,
          email: guideData.email,
          address: guideData.address,
          about: guideData.about,
          workExperience: guideData.workExperience,
          profilePic: null
        });
        setPreviewImage(guideData.profilePic ? 
          `http://localhost:3000/uploads/${guideData.profilePic}` : '');
      }
    } catch (err) {
      setError('Failed to fetch guide profile');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    // Create preview URL
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const data = new FormData();
      for (const key in formData) {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      }

      const response = await axios.put(
        `http://localhost:3000/guideprofile/${guide._id}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.message === 'Guide updated') {
        setGuide(response.data.updatedGuide);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        fetchGuideProfile(); // Refresh the data
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating guide profile');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (!guide) return <div className="text-center py-8">No profile found. Please create a profile.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Edit Guide Profile' : 'Guide Profile'}
        </h1>
        <div className="flex space-x-2">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Picture */}
            <div className="md:col-span-2 flex flex-col items-center mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-2">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No image
                  </div>
                )}
              </div>
              <input
                type="file"
                id="profilePic"
                name="profilePic"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full max-w-xs"
              />
            </div>

            {/* Form fields */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="fullname">Full Name *</label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="age">Age *</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="18"
                max="100"
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="dateOfBirth">Date of Birth *</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="gender">Gender *</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="contactNumber">Contact Number *</label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="mb-4 md:col-span-2">
              <label className="block text-gray-700 mb-2" htmlFor="address">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="mb-4 md:col-span-2">
              <label className="block text-gray-700 mb-2" htmlFor="about">About *</label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="workExperience">Work Experience (years) *</label>
              <input
                type="number"
                id="workExperience"
                name="workExperience"
                value={formData.workExperience}
                onChange={handleChange}
                min="0"
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div className="flex space-x-2 mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded text-white ${isSubmitting ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setError('');
                setSuccess('');
                fetchGuideProfile(); // Reset form data
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="max-w-3xl bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 p-6 flex flex-col items-center">
              <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-200 mb-4">
                {guide.profilePic ? (
                  <img 
                    src={`http://localhost:3000/uploads/${guide.profilePic}`} 
                    alt={guide.fullname} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No image
                  </div>
                )}
              </div>
              <h2 className="text-xl font-semibold">{guide.fullname}</h2>
              <p className="text-gray-600">{guide.email}</p>
            </div>
            <div className="md:w-2/3 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Age</h3>
                  <p>{guide.age}</p>
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                  <p>{new Date(guide.dateOfBirth).toLocaleDateString()}</p>
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                  <p>{guide.gender}</p>
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Contact Number</h3>
                  <p>{guide.contactNumber}</p>
                </div>
                <div className="mb-4 md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p>{guide.address}</p>
                </div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Work Experience</h3>
                  <p>{guide.workExperience} years</p>
                </div>
                <div className="mb-4 md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">About</h3>
                  <p className="whitespace-pre-line">{guide.about}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideProfile;