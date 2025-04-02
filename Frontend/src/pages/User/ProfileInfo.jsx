import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../../utils/helper";
import { BASE_URL } from "../../utils/constants";
import { ChevronDownIcon, ChevronUpIcon, UserIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";

const ProfileInfo = ({ userInfo, onLogout }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate(`/profile-stats/${userInfo._id}`);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    onLogout();
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (!userInfo) return null;

  return (
    <div className="relative flex items-center gap-3" ref={dropdownRef}>
      {/* Profile Avatar */}
      <div
        className="w-12 h-12 flex items-center justify-center rounded-full overflow-hidden border-2 border-cyan-500 text-slate-950 font-medium bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
        onClick={handleProfileClick}
        aria-label="View profile"
        role="button"
      >
        {userInfo.profileImage ? (
          <img
            src={`${BASE_URL}/${userInfo.profileImage}`}
            alt={userInfo.fullName || "User profile"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.parentElement.textContent = getInitials(userInfo.fullName || "");
            }}
          />
        ) : (
          <span className="select-none text-lg">{getInitials(userInfo.fullName || "")}</span>
        )}
      </div>

      {/* User Name and Dropdown */}
      <div className="relative">
        <button
          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 rounded-md px-1 py-1"
          onClick={toggleDropdown}
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
        >
          {userInfo.fullName || "User"}
          {isDropdownOpen ? (
            <ChevronUpIcon className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-5 w-35 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 divide-y divide-gray-200">
            <div className="py-1" role="menu" aria-orientation="vertical">
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                onClick={handleProfileClick}
                role="menuitem"
              >
                <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
                Profile
              </button>
            </div>
            <div className="py-1">
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                onClick={handleLogout}
                role="menuitem"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2 text-gray-500" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;