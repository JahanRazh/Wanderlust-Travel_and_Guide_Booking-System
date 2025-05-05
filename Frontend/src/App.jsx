import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import React, { useState } from 'react';
import TravelStoryHome from './pages/Home/TravelStoryHome';
import Home from './pages/Home/Home';
import Hotelview from './pages/Hotel/Hotelview';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import MainNavbar from './components/MainNavbar';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProfileStats from './pages/User/ProfileStats';
import UserController from './pages/User/UserController';
import Guideview from './pages/Guide/Guideview';
import About from './pages/About';
import TravelStory from './components/Cards/TravelStoryCard';
import AllPackage from './pages/Packages/AllPackage';
import styles from './styles/App.module.css';

import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import AddPackage from './pages/Admin/AddPackages'; // Add the AddPackage component
import AllPackages from './pages/Admin/AllPackages'; // Add the AllPackages component
import PackageDetails from './pages/Packages/packageDetails';
import AllHotels from './pages/Admin/AllHotels';
import AddHotels from './pages/Admin/AddHotels';
import DateTime from './components/datetime';

import NotFound from './components/NotFound';
import CreateGuide from './pages/Guide/CreateGuide';
import GuideProfile from './pages/Guide/GuideProfile';

import ChatBot from './components/ChatBot';





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
    <Router>
      <div className="App min-vh-100" style={{ backgroundColor: '#f7f7f7' }}>
        {/* Use the MainNavbar component instead of inline nav */}
        <MainNavbar userId={userId} logout={logout} />
        
        {/* Alternative: Keep your original nav if MainNavbar isn't ready */}
        {/* 
        <nav className={`navbar-fixed-top ${styles.nav}`}>
          <div>
            <div className={styles.topnav_center}>
              <ul>
                <li><Link to="/home">Home</Link></li>
                <li><link to="/view/Travel-Story">Travel Story</link></li>
                <li><Link to="/view/hotel">Hotel</Link></li>
                <li><Link to="/view/Guide">Guide</Link></li>
                <li><Link to="/view/About">About</Link></li>
                
              </ul>
            </div>
            {userId ? (
              <Link to={'/home'} onClick={logout} className={styles.btn_login}>Logout</Link>
            ) : (
              <Link to={'/login'} className={styles.btn_login}>Login</Link>
            )}
          </div>
        </nav>
        */}
        
        <div>
          <Routes>
            <Route index element={<Home/>} />
            <Route path="/home" element={<Home />} />
            <Route path="/view/travel-story" element={<TravelStoryHome/>} />
            <Route path="/profile-stats" element={<ProfileStats />} />
            <Route path="/profile-stats/:userId" element={<ProfileStats />} />
            <Route path="/admin/usercontroller" element={<UserController />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/admin/hotels" element={<AllHotels />} />
            <Route path="/admin/hotels/add" element={<AddHotels />} />
            <Route path="/datetime" element={<DateTime />} />


            
            <Route path="/login" element={<Login login={login} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/view/hotel" element={<Hotelview />} />
            <Route path="/view/guide" element={<Guideview />} />
            <Route path="/view/about" element={<About />} />
            <Route path="/view/travel-story" element={<TravelStory />} />
            <Route path="/view/TravelPackages" element={<AllPackage />} />
            <Route path="/packages/:packageId" element={<PackageDetails />} />
            <Route path="/admin/packages" element={<AllPackages />} /> {/* All Packages Route */}
            <Route path="/admin/packages/add" element={<AddPackage />} /> {/* Add Package Route */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/createguide" element={<CreateGuide />} />
            <Route path="/guideprofile" element={<GuideProfile />} />


           
            {/* ChatBot Route */}
            <Route path="/chatbot" element={<ChatBot />} />
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
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