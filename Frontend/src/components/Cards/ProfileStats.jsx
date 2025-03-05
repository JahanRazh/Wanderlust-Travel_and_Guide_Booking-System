import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ProfileStats = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = location.state?.userInfo; // Get user data passed from navigation
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [profileImage, setProfileImage] = useState(userInfo?.profileImage || null);

  if (!userInfo) {
    navigate("/dashboard"); // Redirect to dashboard if no user data is available
    return null;
  }

  // Handle profile picture upload
  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setMessage("Please select an image file");
      return;
    }

    // Create form data for uploading
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      setIsUploading(true);
      setMessage("Uploading...");

      // Get token from local storage
      const token = localStorage.getItem('accessToken');
      
      // Make API request to upload profile picture
      const response = await axios.post('/api/users/upload-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      // Update profile image state with the URL returned from server
      setProfileImage(response.data.imageUrl);
      setMessage("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setMessage("Failed to upload profile picture. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-2/4 p-10 bg-white rounded-lg shadow-lg z-50 mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Profile Statistics</h2>
      
      {/* Profile Picture Section */}
      <div className="mb-6 flex flex-col items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-200 flex items-center justify-center">
          {profileImage ? (
            <img 
              src={profileImage} 
              alt="Profile" 
              className="w-full h-full object-cover" 
            />
          ) : (
            <span className="text-gray-500 text-5xl">{userInfo?.fullName?.charAt(0) || ""}</span>
          )}
        </div>
        
        <label className="cursor-pointer bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition">
          {isUploading ? "Uploading..." : "Change Profile Picture"}
          <input 
            type="file" 
            className="hidden" 
            onChange={handleProfilePictureChange}
            accept="image/*"
            disabled={isUploading}
          />
        </label>
        
        {message && (
          <p className={`mt-2 text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
      
      {/* User Info Section */}
      <div>
        <p className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500">
          <strong>Full Name:</strong> {userInfo.fullName}
        </p>
        <p className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500">
          <strong>Email:</strong> {userInfo.email}
        </p>
        <p className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500">
          <strong>Joined Date:</strong> {new Date(userInfo.createdOn).toLocaleDateString() || "N/A"}
        </p>
      </div>
      
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