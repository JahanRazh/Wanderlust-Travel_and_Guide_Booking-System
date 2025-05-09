import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../utils/constants";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LOGO from '../../assets/images/logo/WANDERLUST.LOGO.png';
import { FaSearch, FaFilter, FaPrint, FaDownload, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

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
        (!filters.role || user.role === filters.role) &&
        (!filters.gender || user.gender === filters.gender) &&
        (!filters.status || user.status === filters.status);

      return matchesSearch && matchesFilters;
    })
    .sort((a, b) => {
      if (!a[sortConfig.key]) return 1;
      if (!b[sortConfig.key]) return -1;
      
      const aValue = a[sortConfig.key].toString().toLowerCase();
      const bValue = b[sortConfig.key].toString().toLowerCase();
      
      if (sortConfig.direction === 'asc') {
        return aValue.localeCompare(bValue);
      }
      return bValue.localeCompare(aValue);
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
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
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
              <option value="pending">Pending</option>
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
                        className="w-10 h-10 rounded-full mr-3"
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
                  <div className="flex space-x-2">
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

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default UserController;