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
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchUserProfiles = async (page = 1) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-users?page=${page}&limit=10`, getAuthHeaders());
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setError("Unauthorized: Please log in again.");
        } else if (err.response.status === 404) {
          setError("No users found.");
        } else {
          setError("An error occurred while fetching user profiles.");
        }
      } else {
        setError("Network error: Please check your internet connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfiles(currentPage);
  }, [currentPage]);

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/user/${userId}`, getAuthHeaders());
      setUsers(users.filter(user => user._id !== userId));
      toast.success('User deleted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred while deleting the user.");
      toast.error('Failed to delete user.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleEdit = (userId) => {
    navigate(`${API_BASE_URL}/user/update-profile/${userId}`);

};

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold ml-3 text-primary-foreground">User Profiles</h3>
      <p className="text-primary mb-5 ml-3">Overview of user profiles and their details.</p>
      <div className="relative flex flex-col w-full h-full overflow-scroll text-primary-foreground bg-background shadow-md rounded-lg bg-clip-border">
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              <th className="p-4 border-b border-border bg-card">
                <p className="block text-sm font-normal leading-none text-primary-foreground">
                  Profile Image
                </p>
              </th>
              <th className="p-4 border-b border-border bg-card">
                <p className="block text-sm font-normal leading-none text-primary-foreground">
                  Full Name
                </p>
              </th>
              <th className="p-4 border-b border-border bg-card">
                <p className="block text-sm font-normal leading-none text-primary-foreground">
                  Email
                </p>
              </th>
              <th className="p-4 border-b border-border bg-card">
                <p className="block text-sm font-normal leading-none text-primary-foreground">
                  Gender
                </p>
              </th>
              <th className="p-4 border-b border-border bg-card">
                <p className="block text-sm font-normal leading-none text-primary-foreground">
                  Phone Number
                </p>
              </th>
              <th className="p-4 border-b border-border bg-card">
                <p className="block text-sm font-normal leading-none text-primary-foreground">
                  Actions
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-card">
                <td className="p-4 border-b border-border">
                  {user.profileImage && (
                    <img
                      src={`${API_BASE_URL}/${user.profileImage}`}
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                </td>
                <td className="p-4 border-b border-border">
                  <p className="block text-sm text-primary-foreground">
                    {user.fullName}
                  </p>
                </td>
                <td className="p-4 border-b border-border">
                  <p className="block text-sm text-primary-foreground">
                    {user.email}
                  </p>
                </td>
                <td className="p-4 border-b border-border">
                  <p className="block text-sm text-primary-foreground">
                    {user.gender}
                  </p>
                </td>
                <td className="p-4 border-b border-border">
                  <p className="block text-sm text-primary-foreground">
                    {user.phoneNumber}
                  </p>
                </td>
                <td className="p-4 border-b border-border">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(user._id)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      aria-label="Edit user"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      aria-label="Delete user"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="px-4 py-2 mx-1">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          Next
        </button>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default UserController;