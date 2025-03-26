import React, { useState, useEffect } from "react";
import Admincss from "../../styles/Admin.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  PackageIcon, 
  Hotel, 
  Users,  
  Compass
} from 'lucide-react';
import DateTime from "../../components/datetime";




const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when the component mounts
  }, []);

  // State to store counts
  const [counts, setCounts] = useState({
    packages: 0,
    hotels: 0,
    guides: 0,
    users: 0
  });

  // Fetch counts from backend
  const fetchCounts = async () => {
    try {
      const [
        packagesResponse,
        hotelsResponse,
        guidesResponse,
        usersResponse
      ] = await Promise.all([
        axios.get('http://localhost:3000/packages/count'),
        axios.get('http://localhost:3000/hotels/count'),
        // axios.get('http://localhost:3000/guides/count'),
        // axios.get('http://localhost:3000/users/count')
      ]);

      setCounts({
        packages: packagesResponse.data.count,
        hotels: hotelsResponse.data.count,
        // guides: guidesResponse.data.count,
        // users: usersResponse.data.count
      });
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  // Fetch counts when component mounts
  useEffect(() => {
    fetchCounts();
  }, []);

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
    <div className="min-h-screen bg-gray-100 p-8">
      
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Travel Package Management */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Package Management</h2>
          <img
            src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
            alt="Travel Package Management"
            className="w-full h-48 object-cover rounded-lg mb-4"
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
          />
          <div className="flex">
            <button
              className={Admincss.viewBtn}
              onClick={() => navigate("/admin/guides")}
            >
              All Guides
            </button>
            <button className={Admincss.addBtn}>+</button>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
            alt="User Management"
            className="w-full h-48 object-cover rounded-lg mb-4"
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
    </div>
  );
};

export default Dashboard;