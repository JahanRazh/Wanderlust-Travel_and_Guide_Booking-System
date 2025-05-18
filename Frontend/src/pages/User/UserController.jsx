import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../utils/constants";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LOGO from '../../assets/images/logo/WANDERLUST.LOGO.png';
import { FaSearch, FaFilter, FaPrint, FaDownload, FaSort, FaSortUp, FaSortDown, FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIdCard, FaUserTag, FaClock } from 'react-icons/fa';

const API_BASE_URL = BASE_URL;

const UserController = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    gender: '',
    status: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'fullName',
    direction: 'asc'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
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
      toast.error("Failed to fetch user profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfiles(currentPage);
  }, [currentPage]);

  const handleDelete = async (userId) => {
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

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      role: '',
      gender: '',
      status: ''
    });
    setSearchQuery('');
  };

  const handlePrint = () => {
    const printContent = document.getElementById('printable-content').innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const handleExportCSV = () => {
    const headers = ['Full Name', 'Email', 'Gender', 'Phone', 'Address', 'NIC', 'Role'];
    const csvData = filteredUsers.map(user => [
      user.fullName || 'N/A',
      user.email || 'N/A',
      user.gender || 'N/A',
      user.phoneNumber || 'N/A',
      user.address || 'N/A',
      user.nic || 'N/A',
      user.role || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setSelectedUser(null);
  };

  // Enhanced filtering and sorting
  const filteredUsers = users
    .filter((user) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        user.fullName?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.gender?.toLowerCase().includes(query) ||
        user.phoneNumber?.toLowerCase().includes(query) ||
        user.address?.toLowerCase().includes(query) ||
        user.nic?.toLowerCase().includes(query) ||
        user.role?.toLowerCase().includes(query);

      const matchesFilters = 
        (!filters.role || user.role?.toLowerCase() === filters.role.toLowerCase()) &&
        (!filters.gender || user.gender?.toLowerCase() === filters.gender.toLowerCase()) &&
        (!filters.status || user.status?.toLowerCase() === filters.status.toLowerCase());

      return matchesSearch && matchesFilters;
    })
    .sort((a, b) => {
      if (!a[sortConfig.key]) return 1;
      if (!b[sortConfig.key]) return -1;
      
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle date sorting
      if (sortConfig.key === 'lastLogin' || sortConfig.key === 'lastLogout') {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      } else {
        // Handle string sorting
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
      }
      
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1" />;
    return sortConfig.direction === 'asc' ? 
      <FaSortUp className="ml-1" /> : 
      <FaSortDown className="ml-1" />;
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center mt-10 p-4 bg-red-100 rounded-lg">
      <p className="font-bold">Error:</p>
      <p>{error}</p>
    </div>
  );

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-2">User Management</h3>
          <p className="text-gray-600">Manage and monitor user profiles</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
          >
            <FaFilter className="mr-2" />
            Filters
          </button>
          
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
          >
            <FaPrint className="mr-2" />
            Print
          </button>
          
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
          >
            <FaDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="guide">Guide</option>
            </select>

            <select
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Printable Content */}
      <div id="printable-content" className="hidden">
        <div className="text-center mb-4">
          <img src={LOGO} alt="Company Logo" className="w-80 h-34 mx-auto" />
          <h3 className="text-2xl font-bold mt-2">User Profiles Report</h3>
          <p className="text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left">Full Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Gender</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Address</th>
              <th className="p-4 text-left">NIC</th>
              <th className="p-4 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-t border-gray-200">
                <td className="p-4">{user.fullName || "N/A"}</td>
                <td className="p-4">{user.email || "N/A"}</td>
                <td className="p-4">{user.gender || "N/A"}</td>
                <td className="p-4">{user.phoneNumber || "N/A"}</td>
                <td className="p-4">{user.address || "N/A"}</td>
                <td className="p-4">{user.nic || "N/A"}</td>
                <td className="p-4">{user.role || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Main Content */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="p-4 text-left cursor-pointer" onClick={() => handleSort('fullName')}>
                Full Name {getSortIcon('fullName')}
              </th>
              <th className="p-4 text-left cursor-pointer" onClick={() => handleSort('email')}>
                Email {getSortIcon('email')}
              </th>
              <th className="p-4 text-left cursor-pointer" onClick={() => handleSort('gender')}>
                Gender {getSortIcon('gender')}
              </th>
              <th className="p-4 text-left cursor-pointer" onClick={() => handleSort('phoneNumber')}>
                Phone {getSortIcon('phoneNumber')}
              </th>
              <th className="p-4 text-left cursor-pointer" onClick={() => handleSort('role')}>
                Role {getSortIcon('role')}
              </th>
              <th className="p-4 text-left cursor-pointer" onClick={() => handleSort('status')}>
                Status {getSortIcon('status')}
              </th>
              <th className="p-4 text-left cursor-pointer" onClick={() => handleSort('lastLogin')}>
                Last Login {getSortIcon('lastLogin')}
              </th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center">
                    {user.profileImage ? (
                      <img 
                        src={`${API_BASE_URL}/${user.profileImage}`} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=random`;
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <span className="text-gray-500">{user.fullName?.charAt(0) || '?'}</span>
                      </div>
                    )}
                    <span>{user.fullName || "N/A"}</span>
                  </div>
                </td>
                <td className="p-4">{user.email || "N/A"}</td>
                <td className="p-4">{user.gender || "N/A"}</td>
                <td className="p-4">{user.phoneNumber || "N/A"}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'guide' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role || "N/A"}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status || "inactive"}
                  </span>
                </td>
                <td className="p-4">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewProfile(user)}
                      className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(user._id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
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

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Profile View Modal */}
      {showProfileModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
                <button
                  onClick={closeProfileModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <FaTimes size={24} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Image Section */}
                <div className="flex flex-col items-center bg-gray-50 p-6 rounded-xl">
                  {selectedUser.profileImage ? (
                    <img
                      src={`${API_BASE_URL}/${selectedUser.profileImage}`}
                      alt="Profile"
                      className="w-40 h-40 rounded-full object-cover mb-4 shadow-lg border-4 border-white"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.fullName || 'User')}&background=random`;
                      }}
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg border-4 border-white">
                      <span className="text-5xl text-white font-semibold">
                        {selectedUser.fullName?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">{selectedUser.fullName}</h3>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    selectedUser.role === 'guide' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedUser.role}
                  </span>
                </div>

                {/* User Details Section */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h4>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                          <FaEnvelope className="text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium text-gray-800">{selectedUser.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                          <FaPhone className="text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium text-gray-800">{selectedUser.phoneNumber || 'Not provided'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                          <FaUser className="text-purple-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Gender</p>
                          <p className="font-medium text-gray-800">{selectedUser.gender || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h4>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                          <FaMapMarkerAlt className="text-orange-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium text-gray-800">{selectedUser.address || 'Not provided'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                          <FaIdCard className="text-red-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">NIC</p>
                          <p className="font-medium text-gray-800">{selectedUser.nic || 'Not provided'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
                          <FaUserTag className="text-yellow-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            selectedUser.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {selectedUser.status || 'inactive'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                          <FaClock className="text-indigo-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Login</p>
                          <p className="font-medium text-gray-800">
                            {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Never'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => handleEdit(selectedUser._id)}
                  className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedUser._id);
                    closeProfileModal();
                  }}
                  className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default UserController;