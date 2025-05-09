import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AllGuides = () => {
  const [guides, setGuides] = useState([]);
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("guideProfiles");
    if (stored) {
      const parsedGuides = JSON.parse(stored);
      setGuides(parsedGuides);
      setFilteredGuides(parsedGuides);
    }
  }, []);

  const handleDelete = (email) => {
    if (window.confirm("Are you sure you want to delete this guide?")) {
      const updated = guides.filter((g) => g.email !== email);
      setGuides(updated);
      setFilteredGuides(updated);
      localStorage.setItem("guideProfiles", JSON.stringify(updated));
    }
  };

  const handleEdit = (guide) => {
    navigate("/createguide", { state: guide });
  };

  const handleView = (guide) => {
    localStorage.setItem("guideProfile", JSON.stringify(guide));
    navigate("/guideprofile");
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = guides.filter(
      (g) =>
        g.fullname.toLowerCase().includes(value) ||
        g.email.toLowerCase().includes(value)
    );
    setFilteredGuides(filtered);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Guide Management</h1>
        <input
          type="text"
          placeholder="Search guides by name or email..."
          className="border px-4 py-2 rounded shadow-sm w-72"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">PHOTO</th>
              <th className="px-6 py-3">NAME</th>
              <th className="px-6 py-3">EMAIL</th>
              <th className="px-6 py-3">CONTACT</th>
              <th className="px-6 py-3">ADDRESS</th>
              <th className="px-6 py-3">GENDER</th>
              <th className="px-6 py-3">EXPIRIENCE</th>
              <th className="px-6 py-3">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filteredGuides.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">
                  No guides available.
                </td>
              </tr>
            ) : (
              filteredGuides.map((guide, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-3">{index + 1}</td>
                  <td className="px-6 py-3">
                    {guide.photo ? (
                      <img
                        src={guide.photo}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">No photo</span>
                    )}
                  </td>
                  <td className="px-6 py-3">{guide.fullname}</td>
                  <td className="px-6 py-3">{guide.email}</td>
                  <td className="px-6 py-3">{guide.contactNumber}</td>
                  <td className="px-6 py-3">{guide.address}</td>
                  <td className="px-6 py-3 capitalize">{guide.gender}</td>
                  <td className="px-6 py-3">{guide.workExperience} yrs</td>
                  <td className="px-6 py-3 space-x-2">
                    <button
                      onClick={() => handleView(guide)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(guide)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(guide.email)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllGuides;
