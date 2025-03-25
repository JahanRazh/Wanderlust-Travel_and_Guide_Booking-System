import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CreateGuide.css";

const CreateGuide = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const existingData = location.state || {};

  const [formData, setFormData] = useState({
    fullname: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    email: "",
    address: "",
    about: "",
    workExperience: "",
    profilePic: "",
  });

  useEffect(() => {
    if (existingData.fullname) {
      setFormData(existingData);
    }
  }, [existingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, profilePic: reader.result });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Validate required fields
    if (
      !formData.fullname ||
      !formData.age ||
      !formData.dateOfBirth ||
      !formData.gender ||
      !formData.contactNumber ||
      !formData.email ||
      !formData.address ||
      !formData.workExperience ||
      !formData.about
    ) {
      alert("Please fill in all required fields before submitting.");
      return;
    }
  
    // Save the profile data to localStorage
    localStorage.setItem("guideProfile", JSON.stringify(formData));
    alert("Profile created successfully!");
    navigate("/guideprofile");
  };
  

  return (
    <div className="create-guide-container">
      <h2>Guide Info</h2>
      <form onSubmit={handleSubmit} className="create-guide-form">
        <label>Full Name:</label>
        <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} />

        <label>Age:</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} />

        <label>Date of Birth:</label>
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />

        <label>Gender:</label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <label>Contact Number:</label>
        <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} maxLength="10" />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />

        <label>Address:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} />

        <label>About:</label>
        <input type="text" name="about" value={formData.about} onChange={handleChange} />

        <label>Work Experience (Years):</label>
        <input type="number" name="workExperience" value={formData.workExperience} onChange={handleChange} />

        <label>Profile Picture:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <button 
          type="submit" 
          disabled={
            !formData.fullname ||
            !formData.age ||
            !formData.dateOfBirth ||
            !formData.gender ||
            !formData.contactNumber ||
            !formData.email ||
            !formData.address ||
            !formData.workExperience ||
            !formData.about
          }
          onClick={() => navigate("/guideProfile")} // Links to All Packages page
        >
          Create Profile
        </button>

      </form>
    </div>
  );
};

export default CreateGuide;