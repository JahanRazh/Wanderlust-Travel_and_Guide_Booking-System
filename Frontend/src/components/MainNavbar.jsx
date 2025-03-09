import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LOGO from '../assets/images/logo/WANDERLUST.LOGO.png';
import ProfileInfo from './Cards/ProfileInfo'; // Import the ProfileInfo component

export default function MainNavbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const navigate = useNavigate();
    
    useEffect(() => {
        // Update state if token changes in localStorage from other tabs
        const handleStorageChange = (e) => {
            if (e.key === "token") {
                setIsLoggedIn(!!localStorage.getItem("token"));
            }
        };
        
        // Check auth status on component mount and route changes
        const checkAuthStatus = () => {
            setIsLoggedIn(!!localStorage.getItem("token"));
        };
        
        window.addEventListener("storage", handleStorageChange);
        
        // This ensures the navbar updates when navigating between routes
        checkAuthStatus();
        
        // Optional: you could add a router event listener if available in your version
        // For example with React Router v6:
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [navigate]);
    
    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/login");
    };

    // Mock user info - replace this with actual user data from your app
    const userInfo = {
        fullName: "John Doe", // Replace with the actual user's full name
    };

    return (
        <nav className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
            <div className="flex items-center">
                <img src={LOGO} alt="Logo" className="h-10" />
            </div>
            <ul className="flex items-center hidden md:flex">
                <li className="mx-2"><Link to="/" className="text-black hover:text-gray-300">Home</Link></li>
                
                {isLoggedIn && (
                    <>
                        <li className="mx-2"><Link to="/view/travel-story" className="text-black hover:text-gray-300">Travel Story</Link></li>
                        <li className="mx-2"><Link to="/view/hotel" className="text-black hover:text-gray-300">Hotel</Link></li>
                        <li className="mx-2"><Link to="/view/guide" className="text-black hover:text-gray-300">Guide</Link></li>
                    </>
                )}
                <li className="mx-2"><Link to="/view/Travel-packeges" className="text-black hover:text-gray-300">Packeges</Link></li>
                <li className="mx-2"><Link to="/view/about" className="text-black hover:text-gray-300">About</Link></li>
            </ul>
            <div className="flex items-center">
                {isLoggedIn ? (
                    <ProfileInfo userInfo={userInfo} onLogout={handleLogout} />
                ) : (
                    <button
                        className="text-white px-4 py-2 bg-sky-500 rounded-lg hover:bg-gray-200"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
}