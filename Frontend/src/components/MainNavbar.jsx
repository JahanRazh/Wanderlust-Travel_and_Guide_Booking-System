import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LOGO from '../assets/images/logo/WANDERLUST.LOGO.png';
import ProfileInfo from '../pages/User/ProfileInfo'; // Import the ProfileInfo component
import axiosInstance from '../utils/axiosInstance'; // Import axiosInstance for API calls

const MainNavbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [userInfo, setUserInfo] = useState(null); // State to store user info
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

        // Fetch user info if logged in
        const fetchUserInfo = async () => {
            if (isLoggedIn) {
                try {
                    const response = await axiosInstance.get("/get-user");
                    if (response.data?.user) {
                        setUserInfo(response.data.user);
                    }
                } catch (error) {
                    console.error("Error fetching user info:", error);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        checkAuthStatus();
        fetchUserInfo();

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [navigate, isLoggedIn]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <nav className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
            <div className="flex items-center">
                <img src={LOGO} alt="Logo" className="h-10" />
            </div>
            <ul className="flex items-center hidden md:flex">
                <li className="mx-2"><Link to="/" className="text-black hover:text-gray-300">Home</Link></li>
                <li className="mx-2"><Link to="/view/TravelPackages" className="text-black hover:text-gray-300">Packeges</Link></li>

                
                {isLoggedIn && (
                    <>
                        <li className="mx-2"><Link to="/view/travel-story" className="text-black hover:text-gray-300">Travel Story</Link></li>
                        <li className="mx-2"><Link to="/view/hotel" className="text-black hover:text-gray-300">Hotel</Link></li>
                        <li className="mx-2"><Link to="/view/guide" className="text-black hover:text-gray-300">Guide</Link></li>
                    </>
                )}
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

export default MainNavbar;