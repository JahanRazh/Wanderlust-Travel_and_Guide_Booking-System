import LOGO from '../assets/images/logo/WANDERLUST.LOGO.png';
export default function MainNavbar() {
    return (
        <div>
            {/* Navigation Bar */}
            <nav className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
                <div className="flex items-center">
                    <img src={LOGO} alt="Logo" className="h-10" />

                </div>
                <ul className="hidden md:flex">
                    <li className="mx-2"><a href="#" className="text-black hover:text-gray-300">Home</a></li>
                    <li className="mx-2"><a href="#" className="text-black hover:text-gray-300">Home</a></li>
                    <li className="mx-2"><a href="#" className="text-black hover:text-gray-300">Home</a></li>
                    <li className="mx-2"><a href="#" className="text-black hover:text-gray-300">Home</a></li>
                    <li className="mx-2"><a href="#" className="text-black hover:text-gray-300">Home</a></li>
                </ul>
                <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-200">Login</button>
            </nav>

            
        </div>
    );
}