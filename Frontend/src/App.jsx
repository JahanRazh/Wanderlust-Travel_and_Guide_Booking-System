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
            <Route index element={<Homenew/>} />
            <Route path="/home" element={<Homenew />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/profile-stats" element={<ProfileStats />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/login" element={<Login login={login} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/view/hotel" element={<Hotelview />} />
            <Route path="*" element={<Navigate to="/home" />} />
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