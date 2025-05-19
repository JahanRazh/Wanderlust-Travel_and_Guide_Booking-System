import React, { useState, useEffect } from "react";
import Admincss from "../../styles/Admin.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PackageIcon, Hotel, Users, Compass, Calendar, Printer } from "lucide-react";
import DateTime from "../../components/datetime";
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [bookedPackages, setBookedPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guideApplications, setGuideApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [chartData, setChartData] = useState({
    monthlyIncome: [],
    bookingStatus: {},
    packageBookings: [],
  });
  const [totalIncome, setTotalIncome] = useState(0);
  const [confirmedPackages, setConfirmedPackages] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBookedPackages();
    fetchGuideApplications();
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
        processChartData(response.data);
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
      const [packagesResponse, hotelsResponse, guidesResponse, usersResponse] =
        await Promise.all([
          axios.get("http://localhost:3000/packages/count"),
          axios.get("http://localhost:3000/hotels/count"),
          axios.get("http://localhost:3000/getguide"),
          axios.get('http://localhost:3000/users/count')
        ]);

      setCounts({
        packages: packagesResponse.data.count,
        hotels: hotelsResponse.data.count,
        guides: guidesResponse.data.length,
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

  // Update the fetchGuideApplications function
  const fetchGuideApplications = async () => {
    try {
      console.log('Fetching guide applications...');
      const response = await axios.get('http://localhost:3000/guide/applications');
      console.log('Guide applications response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setGuideApplications(response.data);
        setError(null);
      } else {
        console.error('Invalid data format received:', response.data);
        setError('No guide application data available');
      }
    } catch (error) {
      console.error('Error fetching guide applications:', error);
      if (error.response) {
        setError(`Error: ${error.response.data.message || 'Server error occurred'}`);
      } else if (error.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Failed to fetch guide applications. Please try again later.');
      }
    }
  };

  // Add new function to handle guide application approval
  const handleApproveGuide = async (id) => {
    try {
      await axios.put(`http://localhost:3000/guide/applications/${id}/approve`);
      fetchGuideApplications(); // Refresh the list
      alert('Guide application approved successfully!');
    } catch (err) {
      console.error('Error approving guide application:', err);
    }
  };

  // Add new function to handle guide application rejection
  const handleRejectGuide = async (id) => {
    if (window.confirm('Are you sure you want to reject this application?')) {
      try {
        await axios.put(`http://localhost:3000/guide/applications/${id}/reject`);
        fetchGuideApplications(); // Refresh the list
        alert('Guide application rejected successfully!');
      } catch (err) {
        console.error('Error rejecting guide application:', err);
      }
    }
  };

  // Add new function to handle viewing guide application details
  const handleViewGuide = (application) => {
    setSelectedApplication(application);
  };

  // Add new function to process data for charts
  const processChartData = (bookings) => {
    // Process monthly income
    const monthlyIncome = {};
    const currentDate = new Date();
    let totalConfirmedIncome = 0;
    let confirmedCount = 0;
    
    bookings.forEach(booking => {
      const bookingDate = new Date(booking.startDate);
      const monthYear = `${bookingDate.getMonth() + 1}/${bookingDate.getFullYear()}`;
      
      if (booking.status === 'confirmed') {
        monthlyIncome[monthYear] = (monthlyIncome[monthYear] || 0) + booking.totalBudget;
        totalConfirmedIncome += booking.totalBudget;
        confirmedCount++;
      }
    });

    setTotalIncome(totalConfirmedIncome);
    setConfirmedPackages(confirmedCount);

    // Process booking status
    const bookingStatus = {
      confirmed: 0,
      pending: 0,
      cancelled: 0,
      expired: 0
    };

    bookings.forEach(booking => {
      const endDate = new Date(booking.endDate);
      if (endDate < currentDate && booking.status === 'confirmed') {
        bookingStatus.expired++;
      } else {
        bookingStatus[booking.status]++;
      }
    });

    // Process package bookings
    const packageBookings = {};
    bookings.forEach(booking => {
      if (booking.packageName) {
        packageBookings[booking.packageName] = (packageBookings[booking.packageName] || 0) + 1;
      }
    });

    setChartData({
      monthlyIncome: Object.entries(monthlyIncome).map(([month, income]) => ({
        month,
        income
      })),
      bookingStatus,
      packageBookings: Object.entries(packageBookings).map(([name, count]) => ({
        name,
        count
      }))
    });
  };

  // Chart configurations
  const incomeChartData = {
    labels: chartData.monthlyIncome.map(item => item.month),
    datasets: [
      {
        label: 'Monthly Income',
        data: chartData.monthlyIncome.map(item => item.income),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false,
      },
    ],
  };

  const statusChartData = {
    labels: ['Confirmed', 'Pending', 'Cancelled', 'Expired'],
    datasets: [
      {
        data: [
          chartData.bookingStatus.confirmed,
          chartData.bookingStatus.pending,
          chartData.bookingStatus.cancelled,
          chartData.bookingStatus.expired,
        ],
        backgroundColor: [
          'rgb(34, 197, 94)',
          'rgb(234, 179, 8)',
          'rgb(239, 68, 68)',
          'rgb(156, 163, 175)',
        ],
      },
    ],
  };

  const packageChartData = {
    labels: chartData.packageBookings.map(item => item.name),
    datasets: [
      {
        label: 'Number of Bookings',
        data: chartData.packageBookings.map(item => item.count),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-200 p-8">
      <div className="mb-6">
        <DateTime />
      </div>

      {/* Income and Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Income Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">From {confirmedPackages} confirmed packages</p>
        </div>

        {/* Confirmed Packages Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmed Packages</p>
              <p className="text-2xl font-bold text-blue-600">{confirmedPackages}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">Active bookings</p>
        </div>

        {/* Total Packages Card */}
        <CountCard
          icon={PackageIcon}
          title="Total Packages"
          count={counts.packages}
          onClick={() => navigate("/admin/packages")}
        />

        {/* Total Guides Card */}
        <CountCard
          icon={Compass}
          title="Total Guides"
          count={counts.guides}
          onClick={() => navigate("/allguides")}
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
            onClick={() => navigate("/allguides")}
          />
          <div className="flex">
            <button
              className={Admincss.viewBtn}
              onClick={() => navigate("/allguides")}
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
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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

      {/* Guide Applications Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Guide Applications</h2>
          <div className="flex space-x-4">
            <button
              onClick={fetchGuideApplications}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
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
              onClick={fetchGuideApplications}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        ) : guideApplications.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No guide applications found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guide Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {guideApplications.map((application) => (
                  <tr key={application._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {application.profilePic ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={`http://localhost:3000${application.profilePic}`}
                              alt={application.fullname}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-sm">
                                {application.fullname.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {application.fullname}
                          </div>
                          <div className="text-sm text-gray-500">{application.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.contactNumber}</div>
                      <div className="text-sm text-gray-500">{application.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.workExperience} years</div>
                      <div className="text-sm text-gray-500">{application.age} years old</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        application.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {application.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewGuide(application)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        {!application.isApproved && (
                          <>
                            <button
                              onClick={() => handleApproveGuide(application._id)}
                              className="text-green-600 hover:text-green-900"
                              title="Approve"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => handleRejectGuide(application._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Reject"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Package Bookings Chart - Moved to bottom */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Package Bookings Overview</h2>
        <Bar
          data={packageChartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Number of Bookings per Package',
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Number of Bookings',
                },
              },
            },
          }}
        />
      </div>

      {/* View Application Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">Guide Application Details</h2>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {selectedApplication.profilePic && (
                  <img
                    src={`http://localhost:3000${selectedApplication.profilePic}`}
                    alt={selectedApplication.fullname}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold">{selectedApplication.fullname}</h3>
                  <p className="text-gray-600">{selectedApplication.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p>{selectedApplication.age}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p>{selectedApplication.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Number</p>
                  <p>{selectedApplication.contactNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Work Experience</p>
                  <p>{selectedApplication.workExperience} years</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p>{selectedApplication.address}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">About</p>
                <p>{selectedApplication.about}</p>
              </div>

              {selectedApplication.certificate && (
                <div>
                  <p className="text-sm text-gray-500">Certificate</p>
                  <a
                    href={`http://localhost:3000${selectedApplication.certificate}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Certificate
                  </a>
                </div>
              )}
            </div>

            {!selectedApplication.isApproved && (
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => handleRejectGuide(selectedApplication._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApproveGuide(selectedApplication._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
