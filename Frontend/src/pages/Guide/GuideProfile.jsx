import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2, FiMail, FiPhone, FiMapPin, FiCalendar, FiUser } from "react-icons/fi";

const GuideProfile = () => {
  const navigate = useNavigate();
  const [guideData, setGuideData] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
            <FiUser className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Profile Found</h3>
          <p className="text-gray-500 mb-6">Please create your guide profile to get started</p>
          <button
            onClick={() => navigate("/createguide")}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="relative">
            <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <div className="absolute -bottom-16 left-6">
              <div className="h-32 w-32 rounded-2xl border-4 border-white shadow-lg">
                {guideData.profilePic ? (
                  <img
                    className="h-full w-full rounded-2xl object-cover"
                    src={guideData.profilePic}
                    alt="Profile"
                  />
                ) : (
                  <div className="h-full w-full rounded-2xl bg-indigo-400 flex items-center justify-center">
                    <span className="text-5xl text-white font-bold">
                      {guideData.fullname.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-6 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{guideData.fullname}</h1>
                <p className="text-lg text-indigo-600 font-medium">Professional Tour Guide</p>
                <div className="mt-4 flex items-center text-gray-500">
                  <FiMapPin className="mr-2" />
                  <span>{guideData.address}</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
                  title="Delete Profile"
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
                <button
                  onClick={handleEdit}
                  className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors duration-200"
                  title="Edit Profile"
                >
                  <FiEdit2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* About Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About Me</h2>
              <p className="text-gray-700 leading-relaxed">{guideData.about}</p>
            </div>

            {/* Details Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center text-gray-500 mb-1">
                      <FiCalendar className="mr-2" />
                      <span className="text-sm">Age</span>
                    </div>
                    <p className="text-gray-900 font-medium">{guideData.age} years</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-500 mb-1">
                      <FiCalendar className="mr-2" />
                      <span className="text-sm">Date of Birth</span>
                    </div>
                    <p className="text-gray-900 font-medium">{guideData.dateOfBirth}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-500 mb-1">
                      <FiUser className="mr-2" />
                      <span className="text-sm">Gender</span>
                    </div>
                    <p className="text-gray-900 font-medium capitalize">{guideData.gender}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center text-gray-500 mb-1">
                      <FiMail className="mr-2" />
                      <span className="text-sm">Email</span>
                    </div>
                    <p className="text-gray-900 font-medium">{guideData.email}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-500 mb-1">
                      <FiPhone className="mr-2" />
                      <span className="text-sm">Phone</span>
                    </div>
                    <p className="text-gray-900 font-medium">{guideData.contactNumber}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-500 mb-1">
                      <FiMapPin className="mr-2" />
                      <span className="text-sm">Address</span>
                    </div>
                    <p className="text-gray-900 font-medium">{guideData.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div className="mt-6 bg-gray-50 rounded-xl p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Experience</h3>
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-3">
                  <svg
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-gray-900 font-medium">
                    {guideData.workExperience} years of professional experience
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Certified tour guide with extensive local knowledge
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete your profile? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="py-2 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideProfile;