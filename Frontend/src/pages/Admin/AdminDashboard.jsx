import React, { useState, useEffect } from "react";
import Admincss from "../../styles/Admin.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PackageIcon, Hotel, Users, Compass, Calendar, Printer } from "lucide-react";
import DateTime from "../../components/datetime";

const Dashboard = () => {
  const navigate = useNavigate();
  const [bookedPackages, setBookedPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBookedPackages();
  }, []);

  // State to store counts
  const [counts, setCounts] = useState({
    packages: 0,
    hotels: 0,
    guides: 0,
    users: 0,
  });

  // Fetch booked packages
  const fetchBookedPackages = async () => {
    try {
      const response = await axios.get("http://localhost:3000/bookings");
      console.log("Booked packages response:", response.data); // Debug log
      
      if (response.data && Array.isArray(response.data)) {
        setBookedPackages(response.data);
        setError(null); // Clear any previous errors
      } else {
        console.error("Invalid data format received:", response.data);
        setError("No booking data available");
      }
    } catch (error) {
      console.error("Error fetching booked packages:", error);
      if (error.response) {
        setError(`Error: ${error.response.data.message || 'Server error occurred'}`);
      } else if (error.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError("Failed to fetch booked packages. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch counts from backend
  const fetchCounts = async () => {
    try {
      const [packagesResponse, hotelsResponse, usersResponse] =
        await Promise.all([
          axios.get("http://localhost:3000/packages/count"),
          axios.get("http://localhost:3000/hotels/count"),
          axios.get('http://localhost:3000/users/count')
        ]);

      setCounts({
        packages: packagesResponse.data.count,
        hotels: hotelsResponse.data.count,
        users: usersResponse.data.count
      });
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  // Fetch counts when component mounts
  useEffect(() => {
    fetchCounts();
  }, []);

  // Add function to handle status update
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await axios.patch(`http://localhost:3000/bookings/${bookingId}/status`, {
        status: newStatus
      });
      
      // Update the local state with the new status
      setBookedPackages(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        )
      );
      
      console.log('Status updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update booking status. Please try again.');
    }
  };

  // Handle report generation
  const handleGenerateReport = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Booked Packages Report</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
            h1 { color: #333; }
            .header { text-align: center; margin-bottom: 20px; }
            .date { color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Booked Packages Report</h1>
            <p class="date">Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Package Name</th>
                <th>Customer Name</th>
                <th>Booking Date</th>
                <th>Travel Date</th>
                <th>Status</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              ${bookedPackages.map(booking => `
                <tr>
                  <td>${booking.packageName || 'N/A'}</td>
                  <td>${booking.userName || 'N/A'}</td>
                  <td>${new Date(booking.startDate).toLocaleDateString()}</td>
                  <td>${new Date(booking.endDate).toLocaleDateString()}</td>
                  <td>${booking.status}</td>
                  <td>$${booking.totalBudget}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Add refresh functionality
  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    fetchBookedPackages();
  };

  // Count Card Component
  const CountCard = ({ icon: Icon, title, count, onClick }) => (
    <div
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer flex items-center space-x-4"
      onClick={onClick}
    >
      <div className="bg-blue-100 p-4 rounded-full">
        <Icon className="text-blue-600 w-8 h-8" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-2xl font-bold text-blue-600">{count}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-200 p-8">
      <div className="mb-6">
        <DateTime />
      </div>

      {/* Count Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <CountCard
          icon={PackageIcon}
          title="Total Packages"
          count={counts.packages}
          onClick={() => navigate("/admin/packages")}
        />
        <CountCard
          icon={Hotel}
          title="Total Hotels"
          count={counts.hotels}
          onClick={() => navigate("/admin/hotels")}
        />
        <CountCard
          icon={Compass}
          title="Total Guides"
          count={counts.guides}
          onClick={() => navigate("/admin/guides")}
        />
        <CountCard
          icon={Users}
          title="Total Users"
          count={counts.users}
          onClick={() => navigate("/admin/usercontroller")}
        />
      </div>

      {/* Management Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Travel Package Management */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Package Management</h2>
          <img
            src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
            alt="Travel Package Management"
            className="w-full h-48 object-cover rounded-lg mb-4"
            onClick={() => navigate("/admin/packages")}
          />
          <div className="flex">
            <button
              className={Admincss.viewBtn}
              onClick={() => navigate("/admin/packages")}
            >
              All Packages
            </button>
            <button
              className={Admincss.addBtn}
              onClick={() => navigate("/admin/packages/add")}
            >
              +
            </button>
          </div>
        </div>

        {/* Hotel Management */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Hotel Management</h2>
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
            alt="Hotel Management"
            className="w-full h-48 object-cover rounded-lg mb-4"
            onClick={() => navigate("/admin/hotels")}
          />
          <div className="flex">
            <button
              className={Admincss.viewBtn}
              onClick={() => navigate("/admin/hotels")}
            >
              All Hotels
            </button>
            <button
              className={Admincss.addBtn}
              onClick={() => navigate("/admin/hotels/add")}
            >
              +
            </button>
          </div>
        </div>

        {/* Guide Management */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Guide Management</h2>
          <img
            src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
            alt="Guide Management"
            className="w-full h-48 object-cover rounded-lg mb-4"
            onClick={() => navigate("/admin/guides")}
          />
          <div className="flex">
            <button
              className={Admincss.viewBtn}
              onClick={() => navigate("/admin/guides")}
            >
              All Guides
            </button>
            <button
              className={Admincss.addBtn}
              onClick={() => navigate("/createguide")}
            >
              +
            </button>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
            alt="User Management"
            className="w-full h-48 object-cover rounded-lg mb-4"
            onClick={() => navigate("/admin/usercontroller")}
          />
          <div className="flex">
            <button
              className={Admincss.viewBtn}
              onClick={() => navigate("/admin/usercontroller")}
            >
              All Users
            </button>
          </div>
        </div>
      </div>

      {/* Booked Packages List Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Recent Bookings</h2>
          <div className="flex space-x-4">
            <button
              onClick={handleRefresh}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={handleGenerateReport}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Printer className="w-5 h-5 mr-2" />
              Generate Report
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">{error}</div>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        ) : bookedPackages.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No bookings found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number of People</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookedPackages.map((booking, index) => (
                  <tr key={booking._id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.packageName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.userName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(booking.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(booking.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${booking.totalBudget}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.numberOfPeople}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                          className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
