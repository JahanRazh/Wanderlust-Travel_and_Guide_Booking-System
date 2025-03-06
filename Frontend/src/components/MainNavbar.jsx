import React from 'react';
import { useNavigate } from 'react-router-dom';
import LOGO from '../assets/images/logo/WANDERLUST.LOGO.png';

export default function MainNavbar() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div>
            {/* Navigation Bar */}
            <nav className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
                <div className="flex items-center">
                    <img src={LOGO} alt="Logo" className="h-10" />
                </div>
                <ul className="flex items-center hidden md:flex">
                    <li className="mx-2"><a href="#" className="text-black hover:text-gray-300">Home</a></li>
                    <li className="mx-2"><a href="#" className="text-black hover:text-gray-300">Travel Story</a></li>
                    <li className="mx-2"><a href="#" className="text-black hover:text-gray-300">Hotel</a></li>
                    <li className="mx-2"><a href="#" className="text-black hover:text-gray-300">Guide</a></li>
                    <li className="mx-2"><a href="#" className="text-black hover:text-gray-300">About</a></li>
                </ul>
                <button className="text-white-600 px-4 py-2 bg-sky-500 rounded-lg hover:bg-gray-200" onClick={handleLoginClick}>Login</button>
            </nav>
        </div>
    );
}