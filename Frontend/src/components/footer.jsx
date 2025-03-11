export default function Footer() {
    return (
        <footer className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
            <div className="container mx-auto px-3 py-8">
                {/* Grid Layout for Footer Sections */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About Us Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">About Us</h3>
                        <p className="text-gray-600">
                            We are a leading travel management system, dedicated to providing seamless travel experiences. Explore the world with us!
                        </p>
                    </div>

                    {/* Quick Links Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-600 hover:text-gray-900">Home</a></li><br/>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900">Travel Packages</a></li><br/>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900">Hotels</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900">Guides</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900">About</a></li>
                        </ul>
                    </div>

                    {/* Contact Information Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                        <ul className="text-gray-600 space-y-2">
                            <li>Email: <a href="mailto:support@Wanderlust.com" className="text-gray-600 hover:text-gray-900">Wanderlust.com</a></li><br/>
                            <li>Phone: <a href="tel:+11234567890" className="text-gray-600 hover:text-gray-900">+1(123)456-7890</a></li><br/>
                            <li>Address: 123 Travel St, Malabe</li>
                        </ul>
                    </div>

                    {/* Newsletter Subscription Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Our Newsletter</h3>
                        <p className="text-gray-600 mb-4">
                            Get the latest travel deals and updates directly in your inbox.
                        </p>
                        <form className="">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="p-2 rounded-l-lg bg-gray-100 text-gray-900 focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Social Media Links */}
                <div className="mt-8 border-t border-gray-200 pt-8">
                    <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-600 hover:text-gray-900">
                            <i className="fab fa-facebook"></i> Facebook
                        </a>
                        <a href="#" className="text-gray-600 hover:text-gray-900">
                            <i className="fab fa-twitter"></i> Twitter
                        </a>
                        <a href="#" className="text-gray-600 hover:text-gray-900">
                            <i className="fab fa-instagram"></i> Instagram
                        </a>
                        <a href="#" className="text-gray-600 hover:text-gray-900">
                            <i className="fab fa-linkedin"></i> LinkedIn
                        </a>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="mt-8 text-center text-gray-600">
                    <p>&copy; {new Date().getFullYear()} WANDERLUST. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}