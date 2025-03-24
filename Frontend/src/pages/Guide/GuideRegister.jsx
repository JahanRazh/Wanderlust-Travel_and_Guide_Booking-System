import React, { useState } from "react";
import "./GuideRegister.css"; // Adjust the import path if needed

const GuideRegister = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    email: "",
    address: "",
    workExperience: "",
    profilePic: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "fullname") {
      // Prevent numbers in fullname
      if (/\d/.test(value)) return;
    }

    if (["age", "dateOfBirth", "contactNumber", "workExperience"].includes(name)) {
      // Allow only numbers in these fields
      if (!/^\d*$/.test(value)) return;
    }

    if (name === "contactNumber" && value.length > 10) {
      return; // Limit contact number to 10 digits
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (e) => {
    let value = e.target.value;
    
    // Allow only numbers and dashes
    value = value.replace(/[^0-9-]/g, "");
  
    // Ensure format remains YYYY-MM-DD
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
  
    // Auto-insert dashes as user types (optional)
    if (value.length === 4 || value.length === 7) {
      value += "-";
    }
  
    setFormData({ ...formData, dateOfBirth: value });
  };
  
  const validateDate = (e) => {
    let value = e.target.value;
    
    // Regular expression for valid YYYY-MM-DD format
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    
    if (!datePattern.test(value)) {
      alert("Please enter a valid date in YYYY-MM-DD format.");
      setFormData({ ...formData, dateOfBirth: "" });
    }
  };
  

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePic: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullname) newErrors.fullname = "Full Name is required";
    if (!formData.age) newErrors.age = "Age is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.contactNumber) newErrors.contactNumber = "Contact Number is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
    if (!formData.workExperience) newErrors.workExperience = "Work Experience is required";
    if (!formData.profilePic) newErrors.profilePic = "Profile picture is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form Submitted", formData);
      alert("Guide profile created successfully!");
    }
  };

  return (
    <div className="guide-register-container">
      <h2>Guide Registration</h2>
      <form onSubmit={handleSubmit} className="guide-register-form">
        <label>Full Name:</label>
        <input
          type="text"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          placeholder="Enter full name"
        />
        {errors.fullname && <span className="error">{errors.fullname}</span>}

        <label>Age:</label>
        <input
          type="text"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Enter age"
        />
        {errors.age && <span className="error">{errors.age}</span>}

        <label>Date of Birth:</label>
        <input
          type="text"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleDateChange}
          onBlur={validateDate}
          placeholder="YYYY-MM-DD"
          maxLength="10"
          pattern="\d{4}-\d{2}-\d{2}"
          required
        />
        {errors.dateOfBirth && <span className="error">{errors.dateOfBirth}</span>}

        <label>Gender:</label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <span className="error">{errors.gender}</span>}

        <label>Contact Number:</label>
        <input
          type="text"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          placeholder="Enter contact number"
          maxLength="10"
        />
        {errors.contactNumber && <span className="error">{errors.contactNumber}</span>}

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter address"
        />
        {errors.address && <span className="error">{errors.address}</span>}

        <label>Work Experience (Years):</label>
        <select name="workExperience" value={formData.workExperience} onChange={handleChange}>
          <option value="">Select Experience</option>
          <option value="1">1 Year</option>
          <option value="2">2 Years</option>
          <option value="3">3 Years</option>
          <option value="4">4 Years</option>
          <option value="5+">5+ Years</option>
        </select>
        {errors.workExperience && <span className="error">{errors.workExperience}</span>}

        <label>Profile Picture:</label>
        <input type="file" name="profilePic" accept="image/*" onChange={handleFileChange} />
        {errors.profilePic && <span className="error">{errors.profilePic}</span>}

        <button type="submit">Create Profile</button>
      </form>
    </div>
  );
};

export default GuideRegister;
