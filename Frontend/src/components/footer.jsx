import React from 'react';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin 
} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-200 py-5">
      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">           
        {/* About Us Section */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">About Wanderlust</h3>
          <p className="text-gray-600">
                            We are a leading travel management system, dedicated to providing seamless travel experiences. Explore the world with us!
                        </p>
                    </div>

        {/* Quick Links Section */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Quick Links</h3>
          
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
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h3>
          <ul className="text-gray-600 space-y-2">
                            <li>Email: <a href="mailto:support@Wanderlust.com" className="text-gray-600 hover:text-gray-900">Wanderlust.com</a></li><br/>
                            <li>Phone: <a href="tel:+11234567890" className="text-gray-600 hover:text-gray-900">+1(123)456-7890</a></li><br/>
                            <li>Address: 123 Travel St, Malabe</li>
                        </ul>
                    </div>

        {/* Social Media Links */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Connect With Us</h3>
          <div className="flex space-x-4">
            {[
              { icon: FaFacebook, link: '#facebook', name: 'Facebook' },
              { icon: FaTwitter, link: '#twitter', name: 'Twitter' },
              { icon: FaInstagram, link: '#instagram', name: 'Instagram' },
              { icon: FaLinkedin, link: '#linkedin', name: 'LinkedIn' }
            ].map((social) => (
              <a
                key={social.name}
                href={social.link}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                aria-label={social.name}
              >
                <social.icon size={24} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-4 border-t border-gray-300 pt-4 text-center">
        <p className="text-gray-600">
          &copy; {new Date().getFullYear()} WANDERLUST. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}