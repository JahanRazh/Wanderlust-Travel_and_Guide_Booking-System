import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GuideForm = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    contactNumber: '',
    address: '',
    experience: '',
    profilePic: null,
  });

  const [submitMessage, setSubmitMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profilePic: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      await axios.post('http://localhost:3000/guide/create', form);
      setSubmitMessage('Application submitted successfully!');
      navigate('/guides'); // navigate to the guide list
    } catch (err) {
      setSubmitMessage('Failed to submit the form.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Join as a Tourist Guide</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">

        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={formData.fullname}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-4 py-2"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-4 py-2"
        />

        <input
          type="text"
          name="contactNumber"
          placeholder="Contact Number"
          value={formData.contactNumber}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-4 py-2"
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-4 py-2"
        />

        <input
          type="number"
          name="experience"
          placeholder="Years of Experience"
          value={formData.experience}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-4 py-2"
        />

        <input
          type="file"
          name="profilePic"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />

        <button
          type="submit"
          className="w-full bg-amber-600 text-white py-2 px-4 rounded hover:bg-amber-700 transition font-semibold"
        >
          Apply
        </button>

        {submitMessage && <p className="text-center mt-4 text-sm text-gray-600">{submitMessage}</p>}
      </form>
    </div>
  );
};

export default GuideForm;
