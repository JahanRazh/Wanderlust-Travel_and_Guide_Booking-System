import React from "react";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ userInfo, onLogout }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile-stats", { state: { userInfo } });
  };

  return (
    userInfo && (
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-gray-100 cursor-pointer"
          onClick={handleProfileClick} // Navigate when clicking the profile avatar
        >
          {getInitials(userInfo.fullName || "")}
        </div>
        <div>
          <p
            className="text-sm font-medium cursor-pointer"
            onClick={handleProfileClick} // Navigate when clicking the name
          >
            {userInfo.fullName || ""}
          </p>
          <button
            className="text-sm text-slate-700 underline"
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
