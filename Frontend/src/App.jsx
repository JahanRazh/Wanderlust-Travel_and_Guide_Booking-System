import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import React, { useState } from 'react';
import TravelStoryHome from './pages/Home/TravelStoryHome';
import Home from './pages/Home/Home';
import Hotelview from './pages/Hotel/Hotelview';
import HotelDetails from './pages/Hotel/HotelDetails';
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
import AddPackage from './pages/Admin/AddPackages';
import AllPackages from './pages/Admin/AllPackages';
import PackageDetails from './pages/Packages/packageDetails';
import AllHotels from './pages/Admin/AllHotels';
import AddHotel from './pages/Admin/AddHotel';
import DateTime from './components/datetime';
import BookedPackages from './pages/Admin/BookedPackages';
import MyBookings from './pages/User/MyBookings';

import NotFound from './components/NotFound';
import CreateGuide from './pages/Guide/CreateGuide';
import GuideProfile from './pages/Guide/GuideProfile';
import AllGuides from './pages/Guide/AllGuides';
import GuideForm from './pages/Guide/GuideForm';
import ChatBot from './components/ChatBot';
import Weatherprediction from './pages/WeatherForecast/Weatherprediction';
import GuideApplications from './pages/Admin/GuideApplications';

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
        <MainNavbar userId={userId} logout={logout} />
        
        <div>
          <Routes>
            <Route index element={<Home/>} />
            <Route path="/home" element={<Home />} />
            <Route path="/view/travel-story" element={<TravelStoryHome/>} />
            <Route path="/profile-stats" element={<ProfileStats />} />
            <Route path="/profile-stats/:userId" element={<ProfileStats />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/admin/usercontroller" element={<UserController />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/admin/hotels" element={<AllHotels />} />
            <Route path="/admin/hotels/add" element={<AddHotel />} />
            <Route path="/datetime" element={<DateTime />} />


            
            <Route path="/login" element={<Login login={login} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/view/hotel" element={<Hotelview />} />
            <Route path="/hoteldetails/:id" element={<HotelDetails />} />
            <Route path="/view/guide" element={<Guideview />} />
            <Route path="/view/about" element={<About />} />
            <Route path="/view/travel-story" element={<TravelStory />} />
            <Route path="/view/TravelPackages" element={<AllPackage />} />
            <Route path="/packages/:packageId" element={<PackageDetails />} />
            <Route path="/admin/packages" element={<AllPackages />} />
            <Route path="/admin/packages/add" element={<AddPackage />} />
            <Route path="/admin/booked-packages" element={<BookedPackages />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/createguide" element={<CreateGuide />} />
            <Route path="/guideprofile/:guideId" element={<GuideProfile />} />
            <Route path="/allguides" element={<AllGuides />} />
            <Route path="/guideform" element={<GuideForm />} />
            <Route path="/weather" element={<Weatherprediction />} />

           
            <Route path="/chatbot" element={<ChatBot />} />
            <Route path="/admin/guide-applications" element={<GuideApplications />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const Root = () => {
  const token = localStorage.getItem('token');

  return token ? <Navigate to="/home" /> : <Navigate to="/login" />;
};

export default App;