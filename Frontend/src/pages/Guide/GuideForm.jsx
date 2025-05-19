import React, { useState } from 'react';
import axios from 'axios';

const GuideForm = () => {
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
  });

  const [profilePic, setProfilePic] = useState(null);
  const [certificate, setCertificate] = useState(null); // Guide certificate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (profilePic) data.append('profilePic', profilePic);
    if (certificate) data.append('certificate', certificate);

    try {
      const response = await axios.post('http://localhost:3000/guide/apply', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data) {
        alert('Guide application submitted successfully! We will review your application and get back to you soon.');
        // Reset form
        setFormData({
          fullname: '',
          age: '',
          dateOfBirth: '',
          gender: '',
          contactNumber: '',
          email: '',
          address: '',
          about: '',
          workExperience: '',
        });
        setProfilePic(null);
        setCertificate(null);
      }
    } catch (error) {
      console.error('Error submitting guide application:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to submit guide application. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Tourist Guide</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form Fields */}
        <input type="text" name="fullname" placeholder="Full Name" onChange={handleChange} required className="input" />
        <input type="number" name="age" placeholder="Age" onChange={handleChange} required className="input" />
        <input type="date" name="dateOfBirth" onChange={handleChange} required className="input" />
        
        <select name="gender" onChange={handleChange} required className="input">
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        
        <input type="number" name="contactNumber" placeholder="Contact Number" onChange={handleChange} required className="input" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="input" />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} required className="input" />
        <textarea name="about" placeholder="About Guide" onChange={handleChange} required className="input"></textarea>
        <input type="number" name="workExperience" placeholder="Work Experience (years)" onChange={handleChange} required className="input" />

        {/* File Uploads */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
          <input type="file" accept="image/*" onChange={(e) => setProfilePic(e.target.files[0])} className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Guide Certificate (PDF/Image)</label>
          <input type="file" accept=".pdf,image/*" onChange={(e) => setCertificate(e.target.files[0])} className="input" />
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-amber-600 text-white py-3 rounded hover:bg-amber-700 transition">
          Apply / Submit
        </button>
      </form>
    </div>
  );
};

// Tailwind CSS helper for input styling
const inputStyle = `
  w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500
`;

export default GuideForm;
