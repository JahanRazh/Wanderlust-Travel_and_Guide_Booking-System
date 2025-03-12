import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import React, { useState } from 'react';
import Home from './pages/Home/Home';
import Homenew from './pages/Home/Homenew';
import Hotelview from './pages/Hotel/Hotelview';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import MainNavbar from './components/MainNavbar';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProfileStats from './components/Cards/ProfileStats';
import Guideview from './pages/Guide/Guideview';
import About from './pages/About';
import TravelStory from './components/Cards/TravelStoryCard';
import AllTravelpackages from './pages/Admin/Allpackages';
import styles from './styles/App.module.css';

const App = () => {
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
 
  const login = (id) => {
    localStorage.setItem('userId', id);
    setUserId(id);
  };
 
  const logout = () => {
    localStorage.removeItem('userId');
    setUserId(null);
  };
 
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/home" element={<Homenew/>}/>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/profile-stats" element={<ProfileStats />} /> 
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/admin/packages" element={<AllPackages />} /> {/* Add this route */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/mainnav" element={<MainNavbar />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
};
// Define the Root component to handle the redirect
const Root = () => {
  // Check if token exists in local storage
  const token = localStorage.getItem('token');

  // Redirect to dashboard if authenticated, otherwise to login
  return token ? <Navigate to="/home" /> : <Navigate to="/login" />;
};

export default App;