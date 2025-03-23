import React from "react";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../../utils/helper";
import { BASE_URL } from "../../utils/constants"; // Import the base URL for the API requests

const ProfileInfo = ({ userInfo, onLogout }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/profile-stats/${userInfo._id}`); // Pass the userId in the URL
  };

  return (
    userInfo && (
      <div className="flex items-center gap-3">
        {/* Profile Picture or Initials */}
        <div 
          className="w-13 h-13 flex items-center justify-center rounded-full rounded-full overflow-hidden border-2 border-cyan-500 text-slate-950 font-medium bg-gray-100 cursor-pointer overflow-hidden"
          onClick={handleProfileClick} // Navigate when clicking the profile avatar
        >
          {userInfo.profileImage ? ( // If profile image exists, display it
            <img
              src={`${BASE_URL}/${userInfo.profileImage}`} // Use the full URL to the profile image
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : ( // If no profile image, show initials
            <span>{getInitials(userInfo.fullName || "")}</span>
          )}
        </div>

        {/* User Name and Logout Button */}
        <div>
          <p
            className="text-sm font-medium cursor-pointer"
            onClick={handleProfileClick} // Navigate when clicking the name
          >
            {userInfo.fullName || ""}
          </p>
          <button
            className="text-white px-1.75 py-0.15 bg-sky-500 rounded-lg hover:bg-gray-200"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    )
  );
};

export default ProfileInfo;