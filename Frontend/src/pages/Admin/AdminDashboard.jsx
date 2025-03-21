import React from 'react';
import Admincss from '../../styles/Admin.module.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Travel Package Management */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Package Management</h2>
          <img
            src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
            alt="Travel Package Management"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <p className="text-gray-600">Manage and update travel packages easily.</p>
          <p>
            <button 
              className={Admincss.viewBtn}
              onClick={() => navigate('/admin/packages')}
            >
              All Packages
            </button>    
            <button className={Admincss.addBtn}>+</button>
          </p>
        </div>

        {/* Hotel Management */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Hotel Management</h2>
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
            alt="Hotel Management"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <p className="text-gray-600">Effortlessly handle hotel details and bookings.</p>
          <p>
            <button 
              className={Admincss.viewBtn}
              onClick={() => navigate('/admin/hotels')}
            >
              All Hotels
            </button>    
            <button className={Admincss.addBtn}>+</button>
          </p>
        </div>

        {/* Guide Management */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Guide Management</h2>
          <img
            src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
            alt="Guide Management"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <p className="text-gray-600">Manage guides and their schedules seamlessly.</p>
          <p>
            <button 
              className={Admincss.viewBtn}
              onClick={() => navigate('/admin/guides')}
            >
              All Guides
            </button>    
            <button className={Admincss.addBtn}>+</button>
          </p>
        </div>

        {/* User Management */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
            alt="User Management"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <p className="text-gray-600">Handle user accounts and permissions efficiently.</p>
          <p>
            <button 
              className={Admincss.viewBtn}
              onClick={() => navigate('/admin/usercontroller')}
            >
              All Users
            </button>    
            <button className={Admincss.addBtn}>+</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;