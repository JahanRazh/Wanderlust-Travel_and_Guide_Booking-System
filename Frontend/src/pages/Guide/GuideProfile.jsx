import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./GuideProfile.css";

const GuideProfile = () => {
  const navigate = useNavigate();
  const [guideData, setGuideData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("guideProfile");
    if (storedData) {
      setGuideData(JSON.parse(storedData));
    }
  }, []);

  const handleEdit = () => {
    navigate("/createguide", { state: guideData });
  };

  const handleDelete = () => {
    localStorage.removeItem("guideProfile");
    setGuideData(null);
    navigate("/createguide");
  };

  if (!guideData) {
    return <p>No profile found. Please register.</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img src={guideData.profilePic} alt="Profile" className="profile-pic" />
          <p className="about-text">{guideData.about}</p>
        </div>
        <h2>{guideData.fullname}</h2>
        <p><strong>Age:</strong> {guideData.age}</p>
        <p><strong>Date of Birth:</strong> {guideData.dateOfBirth}</p>
        <p><strong>Gender:</strong> {guideData.gender}</p>
        <p><strong>Contact Number:</strong> {guideData.contactNumber}</p>
        <p><strong>Email:</strong> {guideData.email}</p>
        <p><strong>Address:</strong> {guideData.address}</p>
        <p><strong>Work Experience:</strong> {guideData.workExperience} years</p>
        <div className="profile-actions">
          <button className="edit-btn" onClick={handleEdit}>Edit</button>
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default GuideProfile;