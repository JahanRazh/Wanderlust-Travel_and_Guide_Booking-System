import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../utils/constants";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = BASE_URL;

const UserController = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };
  const fetchUserProfiles = async (page = 1) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-users?page=${page}&limit=10`, getAuthHeaders());
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while fetching user profiles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfiles(currentPage);
  }, [currentPage]);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/user/${userId}`, getAuthHeaders());
      setUsers(users.filter(user => user._id !== userId));
      toast.success('User deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete user.');
    }
  };

  const handleEdit = (userId) => {
    navigate(`/profile-stats/${userId}`);
  };

  if (loading) return <div className="text-center text-xl mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  return (
    <div className="w-full p-6 bg-gray-text-white rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-2">User Profiles</h3>
      <p className="text-gray-400 mb-5">Overview of user profiles and their details.</p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-gray-300">
              <th className="p-4 hidden md:table-cell">Profile Image</th>
              <th className="p-4">Full Name</th>
              <th className="p-4 hidden md:table-cell">Email</th>
              <th className="p-4 hidden sm:table-cell">Gender</th>
              <th className="p-4 hidden sm:table-cell">Phone</th>
              <th className="p-4 hidden lg:table-cell">Address</th>
              <th className="p-4 hidden lg:table-cell">NIC</th>
              <th className="p-4 hidden sm:table-cell">Role</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t border-gray-700 hover:bg-gray-300">
                <td className="p-4 hidden md:table-cell">
                  {user.profileImage ? (
                    <img src={`${API_BASE_URL}/${user.profileImage}`} alt="Profile" className="w-10 h-10 rounded-full" />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="p-4">{user.fullName || "N/A"}</td>
                <td className="p-4 hidden md:table-cell">{user.email || "N/A"}</td>
                <td className="p-4 hidden sm:table-cell">{user.gender || "N/A"}</td>
                <td className="p-4 hidden sm:table-cell">{user.phoneNumber || "N/A"}</td>
                <td className="p-4 hidden lg:table-cell">{user.address || "N/A"}</td>
                <td className="p-4 hidden lg:table-cell">{user.nic || "N/A"}</td>
                <td className="p-4 hidden sm:table-cell">{user.role || "N/A"}</td>
                <td className="p-4 flex space-x-2">
                  <button onClick={() => handleEdit(user._id)} className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600">Edit</button>
                  <button onClick={() => handleDelete(user._id)} className="px-3 py-1 bg-red-500 rounded hover:bg-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-5 space-x-2">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-blue-500 rounded disabled:bg-gray-500">Previous</button>
        <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-blue-500 rounded disabled:bg-gray-500">Next</button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default UserController;