import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';
import Home from './pages/Home/Home';
import Homenew from './pages/Home/Homenew'
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import ProfileStats from "./components/Cards/ProfileStats"; // Import ProfileStats
import AdminDashboard from './pages/Admin/AdminDashboard';
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/home" element={<Homenew/>}/>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/profile-stats" element={<ProfileStats />} /> {/* New Route */}
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
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
  return token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

export default App;
