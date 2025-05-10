import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import LOGO from '../assets/images/logo/WANDERLUST.LOGO.png';
import ProfileInfo from '../pages/User/ProfileInfo';
import axiosInstance from '../utils/axiosInstance';

const MainNavbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [userInfo, setUserInfo] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "token") {
                setIsLoggedIn(!!localStorage.getItem("token"));
            }
        };

        const checkAuthStatus = () => {
            setIsLoggedIn(!!localStorage.getItem("token"));
        };

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

    const isActive = (path) => {
        return location.pathname === path;
    };

    const NavItem = ({ to, children }) => (
        <li className="mx-3">
            <Link 
                to={to} 
                className={`relative px-2 py-1 font-medium text-gray-700 transition-all duration-200 hover:text-sky-600 ${
                    isActive(to) 
                    ? "text-sky-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-sky-600" 
                    : "hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:h-0.5 hover:after:w-full hover:after:bg-sky-600/50"
                }`}
            >
                {children}
            </Link>
        </li>
    );

    return (
        <nav className="bg-white flex items-center justify-between px-6 py-4 drop-shadow-md sticky top-0 z-10">
            <div className="flex items-center">
                <img src={LOGO} alt="Logo" className="h-10" />
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="text-gray-700 focus:outline-none"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        )}
                    </svg>
                </button>
            </div>
            
            {/* Desktop menu */}
            <ul className="hidden md:flex items-center space-x-1">
                <NavItem to="/">Home</NavItem>
                <NavItem to="/view/TravelPackages">Packages</NavItem>
                
                {isLoggedIn && (
                    <>
                        <NavItem to="/view/travel-story">Travel Story</NavItem>
                        <NavItem to="/view/hotel">Hotel</NavItem>
                        <NavItem to="/view/guide">Guide</NavItem>
                    </>
                )}
                <NavItem to="/view/about">About</NavItem>
            </ul>
            
            {/* Mobile menu overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg p-4 z-20">
                    <ul className="flex flex-col space-y-3">
                        <li><Link to="/" className={`block py-2 px-4 rounded-md ${isActive('/') ? 'bg-sky-100 text-sky-600' : 'hover:bg-gray-100'}`}>Home</Link></li>
                        <li><Link to="/view/TravelPackages" className={`block py-2 px-4 rounded-md ${isActive('/view/TravelPackages') ? 'bg-sky-100 text-sky-600' : 'hover:bg-gray-100'}`}>Packages</Link></li>
                        
                        {isLoggedIn && (
                            <>
                                <li><Link to="/view/travel-story" className={`block py-2 px-4 rounded-md ${isActive('/view/travel-story') ? 'bg-sky-100 text-sky-600' : 'hover:bg-gray-100'}`}>Travel Story</Link></li>
                                <li><Link to="/view/hotel" className={`block py-2 px-4 rounded-md ${isActive('/view/hotel') ? 'bg-sky-100 text-sky-600' : 'hover:bg-gray-100'}`}>Hotel</Link></li>
                                <li><Link to="/view/guide" className={`block py-2 px-4 rounded-md ${isActive('/view/guide') ? 'bg-sky-100 text-sky-600' : 'hover:bg-gray-100'}`}>Guide</Link></li>
                            </>
                        )}
                        <li><Link to="/view/about" className={`block py-2 px-4 rounded-md ${isActive('/view/about') ? 'bg-sky-100 text-sky-600' : 'hover:bg-gray-100'}`}>About</Link></li>
                    </ul>
                </div>
            )}
            
            <div className="flex items-center">
                {isLoggedIn ? (
                    <ProfileInfo userInfo={userInfo} onLogout={handleLogout} />
                ) : (
                    <button
                        className="text-white px-5 py-2 bg-sky-500 rounded-lg hover:bg-sky-600 transition-colors duration-200 shadow-sm"
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